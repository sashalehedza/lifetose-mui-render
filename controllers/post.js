import mongoose from 'mongoose'
import CommentModal from '../models/comment.js'
import PostModal from '../models/post.js'

export const getPosts = async (req, res) => {
  try {
    const posts = await PostModal.find()
    res.status(200).json(posts)
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

export const getPost = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: 'Post not found' })
  }
  if (mongoose.Types.ObjectId.isValid(id)) {
    const post = await PostModal.findById(id)
    if (!post) {
      res.status(404).json({ message: 'Post not found' })
    }
    if (post) {
      res.status(200).json(post)
    }
  }
}

export const createPost = async (req, res) => {
  const post = req.body
  const newPost = new PostModal({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  })

  try {
    await newPost.save()
    res.status(201).json(newPost)
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

export const deletePost = async (req, res) => {
  const { id } = req.params
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No post exist with id: ${id}` })
    }
    await PostModal.findByIdAndRemove(id)
    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

export const updatePost = async (req, res) => {
  const { id } = req.params

  const post = req.body

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No post exist with id: ${id}` })
    }

    const updatedPost = {
      ...post,
      _id: id,
    }

    await PostModal.findByIdAndUpdate(id, updatedPost, { new: true })
    res.json(updatedPost)
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

export const getPostsByUser = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "User doesn't exist" })
  }
  const userPosts = await PostModal.find({ creator: id })
  res.status(200).json(userPosts)
}

export const getPostsBySearch = async (req, res) => {
  const { searchQuery } = req.query
  try {
    const title = new RegExp(searchQuery, 'i')
    const posts = await PostModal.find({ title })
    res.json(posts)
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

export const getPostsByTag = async (req, res) => {
  const { tag } = req.params
  try {
    const posts = await PostModal.find({ tags: { $in: tag } })
    res.json(posts)
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

export const getRelatedPosts = async (req, res) => {
  const tags = req.body
  try {
    const posts = await PostModal.find({ tags: { $in: tags } })
    res.json(posts)
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

export const likePost = async (req, res) => {
  const { id } = req.params
  try {
    if (!req.userId) {
      return res.json({ message: 'User is not authenticated' })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No post exist with id: ${id}` })
    }

    const post = await PostModal.findById(id)

    const index = post.likes.findIndex((id) => id === String(req.userId))

    if (index === -1) {
      post.likes.push(req.userId)
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId))
    }

    const updatedPost = await PostModal.findByIdAndUpdate(id, post, {
      new: true,
    })

    res.status(200).json(updatedPost)
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

export const createPostReview = async (req, res) => {
  const { rating, text } = req.body

  const post = await PostModal.findById(req.params.id)

  if (post) {
    const alreadyReviewed = post.reviews.find(
      (r) => r.user.toString() === req.userId.toString()
    )

    if (alreadyReviewed) {
      res.status(400).json({ message: 'Something went wrong' })
    }

    let review = CommentModal({
      text,
      rating: Number(rating),
      name: req.user.name,
      user: req.user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    post.reviews.push(review)

    post.numReviews = post.reviews.length

    post.rating =
      post.reviews.reduce((acc, item) => item.rating + acc, 0) /
      post.reviews.length

    await post.save()
    res.json(post)
  } else {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

export const deletePostReview = async (req, res) => {
  const post = await PostModal.findById(req.params.id)

  if (post) {
    post.reviews = post.reviews.filter(
      (review) => String(review._id) !== String(req.params.reviewId)
    )

    post.numReviews = post.reviews.length

    post.rating =
      post.reviews.length !== 0
        ? post.reviews.reduce((acc, item) => item.rating + acc, 0) /
          post.reviews.length
        : 0

    await post.save()
    res.json(post)
  } else {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

export const updatePostReview = async (req, res) => {
  const post = await PostModal.findById(req.params.id)

  if (post) {
    post.reviews = post.reviews.map((review) =>
      String(review._id) === String(req.params.reviewId)
        ? { ...review, ...req.body, updatedAt: new Date() }
        : review
    )
    post.numReviews = post.reviews.length

    post.rating =
      post.reviews.length !== 0
        ? post.reviews.reduce((acc, item) => item.rating + acc, 0) /
          post.reviews.length
        : 0

    await post.save()
    res.json(post)
  } else {
    res.status(404).json({ message: 'Something went wrong' })
  }
}
