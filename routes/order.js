import express from 'express'
const router = express.Router()
import { auth, admin } from '../middleware/auth.js'

import {
  getAllOrders,
  getMyOrders,
  createOrder,
  orderPaid,
  orderDelivered,
} from '../controllers/order.js'

router.get('/', auth, admin, getAllOrders)
router.get('/userOrders', auth, getMyOrders)

router.post('/create', auth, createOrder)

router.patch('/paid/:id', auth, admin, orderPaid)
router.patch('/delivered/:id', auth, admin, orderDelivered)

export default router
