const mongoose = require("mongoose")

const reply_Schema = new mongoose.Schema({
  text: {type: String, required: true},
	created_on: {type: Date, default: Date.now()},
	reported: {type: Boolean, default: false},
	delete_password: {type: String, required: true},
  thread_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
})

module.exports = mongoose.model("Reply", reply_Schema)