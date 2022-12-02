'use strict';

const thread = require('../controllers/threadController')
const reply = require('../controllers/replyController')

module.exports = function (app) {
  
  app
    .route("/api/threads/:board")
    .post(thread.threadPost)
    .get(thread.threadGet)
    .put(thread.threadPut)
    .delete(thread.threadDel);

  app
    .route("/api/replies/:board")
    .post(reply.replyPost)
    .get(reply.replyGet)
    .put(reply.replyPut)
    .delete(reply.replyDel);
  
};
