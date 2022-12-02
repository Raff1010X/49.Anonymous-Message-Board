const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    let thread_id
    let reply_id;
    test("1. Creating a new thread: POST request to /api/thread/{board}", (done) => {
        chai
            .request(server)
            .post("/api/threads/functional-tests")
            .set("content-type", "application/json")
            .send({ text: "test text", delete_password: "delete_password" })
            .redirects(0)
            .end((err, res) => {
                assert.equal(res.status,302 );
                done();
            });
    });
    test("2. Vieving the 10 most recent threads with 3 replies each: GET", (done) => {
        chai
            .request(server)
            .get("/api/threads/functional-tests")
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.exists(res.body[0], 'There is a thread');
                assert.equal(res.body[0].text, "test text");
                thread_id = res.body[0]._id;
                done();
            });
    });
    test("3. Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password", (done) =>{
        chai
            .request(server)
            .delete("/api/threads/functional-tests")
            .set("content-type", "application/json")
            .send({thread_id: thread_id,delete_password:"dud"})
            .end((err, res) =>{
                assert.equal(res.status, 200);
                assert.equal(res.text, "incorrect password");
                done();
            })
    });
    test("4. Reporting a thread: PUT request to /api/threads/{board}", (done) =>{
        chai
            .request(server)
            .put("/api/threads/functional-tests")
            .set("content-type", "application/json")
            .send({thread_id : thread_id})
            .end((err, res) =>{
                assert.equal(res.status, 200);
                assert.equal(res.text, "reported");
                done();
            });
    });
  
  test("5. Creating a new thread: POST request to /api/replies/{board}", (done) => {
        chai
            .request(server)
            .post("/api/replies/functional-tests")
            .set("content-type", "application/json")
            .send({ thread_id: thread_id, text: "text to test", delete_password: "delete test password" })
            .redirects(0)
            .end((err, res) => {
                assert.equal(res.status, 302 );
                done();
            });
    });
    test("6. Viewing a signle thread with all replies: GET request to /api/replies/{board}", (done) =>{
        chai
            .request(server)
            .get("/api/replies/functional-tests")
            .set("content-type", "application/json")
            .query({thread_id: thread_id,})
            .end((err, res) =>{
                assert.equal(res.status, 200)
                assert.equal(res.body._id, thread_id);
                assert.equal(res.body.text, "test text");
                assert.equal(res.body.replies[0].text, "text to test")
                reply_id = res.body.replies[0]._id;
                done();
            });

    });
    test("7. Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password", (done) =>{
        chai
            .request(server)
            .delete("/api/replies/functional-tests")
            .set("content-type", "application/json")
            .send({thread_id: thread_id, reply_id: reply_id, delete_password:"dud2"})
            .end((err, res) =>{
                assert.equal(res.status, 200);
                assert.equal(res.text, "incorrect password");
                done();
            })
    });
    test("8. Reporting a reply: PUT request to /api/replies/{board}", (done) =>{
        chai
            .request(server)
            .put("/api/replies/functional-tests")
            .set("content-type", "application/json")
            .send({thread_id : thread_id, reply_id: reply_id})
            .end((err, res) =>{
                assert.equal(res.status, 200);
                assert.equal(res.text, "reported");
                done();
            });
    });
    test("9. Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password", (done) =>{
        chai
            .request(server)
            .delete("/api/replies/functional-tests")
            .set("content-type", "application/json")
            .send({thread_id: thread_id, reply_id: reply_id, delete_password:"delete test password"})
            .end((err, res) =>{
                assert.equal(res.status, 200);
                assert.equal(res.text, "success");
                done();
            })
    });
    test("10 .Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password", (done) =>{
        chai
            .request(server)
            .delete("/api/threads/functional-tests")
            .set("content-type", "application/json")
            .send({thread_id: thread_id,delete_password:"delete_password"})
            .end((err, res) =>{
                assert.equal(res.status, 200);
                assert.equal(res.text, "success");
                done();
            })
    });
});
