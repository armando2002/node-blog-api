const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');
// add in blog-posts.js once modularized

const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('common'));

// add some blog posts
// title, content, author
BlogPosts.create('Favorite Cat Food', 'My favorite cat food is raw salmon!', "Kuroi");
BlogPosts.create('Favorite Cat Toy', 'My favorite cat toy is the laser pointer!', "Kuroi");

// initial .get
app.get('/blog-posts', (req, res) => {
    res.json(BlogPosts.get());
  });

// initial .post
app.post('/blog-posts', jsonParser, (req, res) => {
    // ensure `title` 'content' and `author` are in request body
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(item);
  });

  // initial delete
  app.delete('/blog-posts/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.id}\``);
    res.status(204).end();
  });

  // initial .put
  app.put('/blog-posts/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'id'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post \`${req.params.id}\``);
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author 
    });
    res.status(204).end();
  });

  app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
  });
