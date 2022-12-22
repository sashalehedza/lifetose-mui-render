import mongoose from 'mongoose'

export const commentSchema = mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Text is required'],
  },
  rating: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
})

const CommentModal = mongoose.model('Comment', commentSchema)

export default CommentModal
