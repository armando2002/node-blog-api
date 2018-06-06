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
    it('should update a blog post on PUT', function() {
        const updatePost = {
            id: "9c9b77bf-39a9-44f1-b5ad-22c79aa1b8a8",
            title: "New Favorite Cat Food",
            content: "My new favorite cat food is tuna!",
            author: "Kuroi"
        }

        const expectedKeys = ['publishDate'].concat(Object.keys(updatePost));

        return chai.request(app)
            console.log(updatePost.id);
            .put(`/blog-posts/${updatePost.id}`)
            .send(updatePost)
            .then(function(res) {
                expect(res).to.have.status(204);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(resp.body).tp.have.all.keys(expectedKeys);
                expect(res.body.id).to.equal(updatePost.id);
                expect(res.body.title).to.equal(updatePost.title);
                expect(res.body.content).to.equal(updatePost.content);
                expect(res.body.author).to.equal(updatePost.author);

            });

    });
    // it should do something on DELETE




});