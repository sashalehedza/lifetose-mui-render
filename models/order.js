import mongoose from 'mongoose'

const orderSchema = mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  orderItems: [],
  shippingMethod: { type: String, required: true },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  subtotalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
})

const OrderModal = mongoose.model('Order', orderSchema)

export default OrderModal
