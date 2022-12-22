import mongoose from 'mongoose'

const couponSchema = mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  percent: {
    type: Number,
    required: true,
    default: 0,
  },
})

const CouponModal = mongoose.model('Coupon', couponSchema)

export default CouponModal
