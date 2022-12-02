"use strict"
const mongoose = require("mongoose")

const Thread = require("../models/threadModel")
const Reply = require("../models/replyModel")

exports.threadPost = async (req, res) => {
  const { text, delete_password } = req.body
  let board = req.body.board ? req.body.board : req.params.board
  const thread = new Thread({board, text, delete_password})
  let saveThread = await thread.save()
  if (saveThread)
    res.redirect(`/b/${board}/`)
}

exports.threadGet = async (req, res) => {
  const board = req.params.board
  let threads = await Thread
    .find({board})
    .populate('replies')
    .sort({bumped_on: 'desc'})
    .limit(10)
    .select('-reported -delete_password -__v')
  
  threads = threads.map(el => {
    el.replies = el.replies.sort((a, b) => {
      return new Date(b.created_on) - new Date(a.created_on)
    })  
    el.replies = el.replies.map(re => {
      return {_id: re._id, thread_id: re.thread_id, text: re.text,  created_on: re.created_on}
    })
    if (el.replies.length > 3) 
      el.replies = el.replies.slice(0, 3)
    return el
  })
  res.json(threads)
}

exports.threadPut = async (req, res) => {
  const { thread_id } = req.body
  const board = req.params.board
  let thread = await Thread.findOneAndUpdate({ thread_id, board }, {reported: true})
  if (thread) res.send("reported")
}

exports.threadDel = async (req, res) => {
  const { thread_id, delete_password } = req.body
  let thread = await Thread.findOne({ thread_id, delete_password})
  if (!thread) {
    res.send("incorrect password")
    return
  }
  thread.remove((err, data) => {
    if (err || !data) {
      console.log({ error: "thread not found" })
      return
    }
    res.send("success")
  })
}