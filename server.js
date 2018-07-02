const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// grab database URL and Port from config.js
const {DATABASE_URL, PORT} = require('./config');

// grab BlogPost model from models.js
const {BlogPost} = require('./models');

const app = express();

app.use(morgan('common'));

app.use(express.json());

// main API calls (GET, POST, DELETE, PUT )

// GET ALL
app.get('/posts', (req,res) => {
  BlogPost.find().then(posts => {
    res.json(posts.map(post => post.serialize()));
  })
  .catch(err => {
    console.err(err);
    res.status(500).json({ error: 'internal server error'});
  });
});

// GET BY ID
app.get('/posts/:id', (req,res) => {
  BlogPost.findById(req.params.id).then(post => res.json(post.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'internal server error'});
  });
});

// POST

// DELETE

// PUT


// server connections
let server;

// run server
function runServer(databaseURL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseURL, err => {
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

