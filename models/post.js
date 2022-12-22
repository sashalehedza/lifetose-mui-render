import mongoose from 'mongoose'
import { commentSchema } from './comment.js'

const postSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    name: String,
    creator: String,
    price: Number,
    tags: [String],
    imageFile: String,
    createdAt: {
      type: Date,
      default: new Date(),
    },
    likes: {
      type: [String],
      default: [],
    },
    discount: Number,
    saleCount: Number,
    saleDiscount: Number,
    reviews: [],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
)

const PostModal = mongoose.model('Post', postSchema)

export default PostModal
