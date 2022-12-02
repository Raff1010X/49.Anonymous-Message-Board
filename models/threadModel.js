const mongoose = require("mongoose");

const {reply_Schema} = require('./replyModel')

const thread_Schema = new mongoose.Schema({
	board: {type: String, required: true},
  text: {type: String, required: true},
	created_on: {type: Date, default: Date.now()},
	bumped_on: {type: Date, default: Date.now()},
	reported: {type: Boolean, default: false},
	delete_password: {type: String, required: true},
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
})

thread_Schema.virtual('replies', {
  ref: 'Reply',
  localField: '_id',
  foreignField: 'thread_id',
});

module.exports = mongoose.model("Thread", thread_Schema);