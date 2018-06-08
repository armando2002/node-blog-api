const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Posts', function() {
    
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    // it should do something on GET
    it('should list blog posts on GET', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.at.least(1);
                const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
                res.body.forEach(function(item) {
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    });
    
    // it should do something on POST
    it('should add a blog post on POST', function() {
        const blogPost = {
            title: "Test blog post",
            content: "This is a test blog post.",
            author: "Test Author"
        };

        const expectedKeys = ['id', 'publishDate'].concat(Object.keys(blogPost));
    

        return chai.request(app)
            .post('/blog-posts')
            .send(blogPost)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.all.keys(expectedKeys);
                expect(res.body.title).to.equal(blogPost.title);
                expect(res.body.content).to.equal(blogPost.content);
                expect(res.body.author).to.equal(blogPost.author);

        });

    });

    // it should do something on PUT
    // the ID seems to change randomly, I need to request the ID first before updating
    it('should update a blog post on PUT', function() {
        // ask for items first
        return chai.request(app)
            .get('/blog-posts')
            .then(function (res) {
                const updatePost = {
                    id: res.body[0].id,
                    title: "New Favorite Cat Food updated",
                    content: "My new favorite cat food is tuna!",
                    author: "Kuroi"
                }
            });


       // const expectedKeys = ['publishDate'].concat(Object.keys(updatePost));
        return chai.request(app)
            .put(`/blog-posts/${updatePost.id}`)
            .send(updatePost)
            .then(function(res) {
                expect(res).to.have.status(204);
            });

    });
    // it should do something on DELETE
    it('should delete a blog post on delete', function() {
        return chai.request(app)
        // get the blog posts
        .get('/blog-posts')
        // then delete the first blog post found
        .then(function(res) {
            return chai.request(app)
            .delete(`/blog-posts/${res.body[0].id}`)
            .then(function (res) {
                expect(res).to.have.status(204);
            });
        });

    });

});