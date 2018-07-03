const express = require('express');
require('dotenv').config()
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// grab database URL and Port from config.js
const {DATABASE_URL, PORT} = require('./config');
console.log(DATABASE_URL, PORT);

// grab BlogPost model from models.js
const {BlogPost} = require('./models');

const app = express();

app.use(morgan('common'));

app.use(express.json());

// main API calls (GET, POST, DELETE, PUT )

// GET ALL
app.get('/blog-posts', (req,res) => {
  BlogPost.find().then(posts => {
    res.json(posts.map(post => post.serialize()));
  })
  .catch(err => {
    console.err(err);
    res.status(500).json({ error: 'internal server error'});
  });
});

// GET BY ID
app.get('/blog-posts/:id', (req,res) => {
  BlogPost.findById(req.params.id).then(post => res.json(post.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'internal server error'});
  });
});

// POST

// check for required fields
app.post('/blog-posts', (req,res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `${field} missing in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  
  // create blog post

  // for some reason, author is coming across as 'undefined undefined' in POSTMAN unless I submit "firstName", "lastName"
  BlogPost.create({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  })
  .then(blogPost => res.status(201).json(blogPost.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'internal server error'});
  });
  
});

// DELETE

// Queston for Krishna, how do I get my delete message to show up in Postman? All I see is the 204

app.delete('/blog-posts/:id', (req,res) => {
  BlogPost.findByIdAndRemove(req.params.id)
  .then(() => {
    res.json({message: `deleted ${req.params.id}`});
  })
  .catch(err => {
    res.status(500).json({ error: 'internal server error'});
  });
});

// PUT
app.put('/blog-posts/:id', (req,res) => {
  if (!(req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'ID in URL and Body do not match'
    });
  }

  const updateBlogPost = {};
  const updateFields = ['title', 'content', 'author'];
  updateFields.forEach(field => {
    if (field in req.body) {
      updateBlogPost[field] = req.body[field];
    }
  });

  BlogPost.findByIdAndUpdate(req.params.id, { $set: updateBlogPost }, {new: true })
  .then(updateBlogPost => res.status(204).end())
  .catch(err => res.status(500).json({ message: 'internal server error'}));
});


// server connections
let server;

// run server
function runServer(DATABASE_URL, port = PORT) {
  console.log(DATABASE_URL);
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve();
    }).on('error', err => {
      mongoose.disconnect();
      reject(err);
    });
  });
  });
}

// close server
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
           return reject(err);
        // so we don't also call `resolve()
      }
      resolve();
    });
  });
});
}

// if server.js is called directly, run this block
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};

