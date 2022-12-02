"use strict";

const Thread = require("../models/threadModel")
const Reply = require("../models/replyModel")

exports.replyPost = async (req, res) => {
  const { thread_id, text, delete_password } = req.body
  const board = req.params.board
  const created_on = new Date(Date.now())

  let thread = await Thread.findById(thread_id)
  thread.bumped_on = created_on
  let saveThread = await thread.save()

  const reply = new Reply({text, delete_password, thread_id, created_on})
  let saveReply = await reply.save()
  if (saveThread && saveReply)
    res.redirect(`/b/${board}/${thread_id}/`)
}

exports.replyGet = async (req, res) => {
  const { thread_id } = req.query
  let thread = await Thread.findById(thread_id).populate('replies').select('-reported -delete_password -__v')
  if (!thread) {
    res.json({ error: "thread not found" })
    return
  }
  thread.replies = thread.replies.map(el => {
      return {_id: el._id, thread_id: el.thread_id, text: el.text,  created_on: el.created_on}
  })
  thread.replies = thread.replies.sort((a, b) => {
      return new Date(b.created_on) - new Date(a.created_on)
  })
  res.json(thread)
}

exports.replyPut = async (req, res) => {
  const { reply_id } = req.body
  let reply = await Reply.findOneAndUpdate({ reply_id }, {reported: true})
  if(!reply){
    console.log({ error: "reply not found" })
    return
  }
  res.send("reported")
}

exports.replyDel = async (req, res) => {
  const { reply_id, delete_password } = req.body
  let reply = await Reply.findById(reply_id)
  if(!reply){
    console.log({ error: "reply not found" })
    return
  }

  if(reply.delete_password !== delete_password){
    res.send("incorrect password")
    return
  }
  
  reply.text = '[deleted]'
  reply.save((err, data) => {
    if (err || !data) {
      res.send("error saving reply")
    } else {
      res.send("success")
    }
  })
}