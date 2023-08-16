const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      
    },
    user: {
      type: String,
      
    },
    password: {
      type: String,
      
    },
    content: {
      type: String,
      
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
