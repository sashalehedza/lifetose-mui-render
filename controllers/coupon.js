import mongoose from 'mongoose'
import CouponModal from '../models/coupon.js'

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await CouponModal.find()
    res.status(200).json(coupons)
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

export const getCoupon = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: 'Coupon not found' })
  }
  if (mongoose.Types.ObjectId.isValid(id)) {
    const post = await CouponModal.findById(id)
    if (!post) {
      res.status(404).json({ message: 'Coupon not found' })
    }
    if (post) {
      res.status(200).json(post)
    }
  }
}

export const createCoupon = async (req, res) => {
  const { name, percent } = req.body

  const newCoupon = new CouponModal({
    user: req.userId,
    name,
    percent,
  })

  newCoupon.save()
  res.status(201).json(newCoupon)
}

export const deleteCoupon = async (req, res) => {
  const { id } = req.params
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No coupon exist with id: ${id}` })
    }
    await CouponModal.findByIdAndRemove(id)
    res.json({ message: 'Coupon deleted successfully' })
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

export const updateCoupon = async (req, res) => {
  const { id } = req.params

  const coupon = req.body

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No coupon exist with id: ${id}` })
    }

    const updatedCoupon = {
      ...coupon,
      _id: id,
    }

    await CouponModal.findByIdAndUpdate(id, updatedCoupon, { new: true })
    res.json(updatedCoupon)
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

export const getCouponByName = async (req, res) => {
  const { name } = req.body

  const coupon = await CouponModal.findOne({ name: name })
  if (!coupon) {
    res.status(404).json({ message: 'Coupon not found' })
  }
  if (coupon) {
    res.status(200).json(coupon)
  }
}
