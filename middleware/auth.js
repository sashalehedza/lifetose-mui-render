import jwt from 'jsonwebtoken'
import UserModal from '../models/user.js'

const secret = 'test'

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const isCustomAuth = token.length < 500
    let decodedData
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, secret)
      req.user = await UserModal.findById(decodedData.id).select('-password')
      req.userId = decodedData?.id
    }
    next()
  } catch (error) {
    console.log(error)
  }
}

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' })
  }
}

export { auth, admin }
