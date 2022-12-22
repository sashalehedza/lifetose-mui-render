import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'

import userRouter from './routes/user.js'
import postRouter from './routes/post.js'
import orderRouter from './routes/order.js'
import couponRouter from './routes/coupon.js'

import dotenv from 'dotenv'

// only when ready to deploy
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

const app = express()
dotenv.config()

// only when ready to deploy
const __dirname = dirname(fileURLToPath(import.meta.url))
// only when ready to deploy
app.use(express.static(path.resolve(__dirname, './client/build')))

app.use(morgan('dev'))
app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.use('/users', userRouter)
app.use('/post', postRouter)
app.use('/orders', orderRouter)
app.use('/coupons', couponRouter)

// only when ready to deploy
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})

const port = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`))
  })
  .catch((error) => console.log(`${error} did not connect`))
