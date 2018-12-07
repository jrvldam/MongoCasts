const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = mongoose.Schema({
  content: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
});

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;