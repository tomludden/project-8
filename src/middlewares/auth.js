const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const User = require('../api/models/users')
const { verifyJwt } = require('../config/jwt')

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const parsedToken = token.replace('Bearer ', '')

    const { id } = verifyJwt(parsedToken)

    const user = await User.findById(id)

    user.password = null
    req.user = user
    next()
  } catch (error) {
    return res.status(400).json('Not authorised')
  }
}

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(400).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    if (user.role !== 'admin') {
      return res
        .status(400)
        .json({ message: 'Only admins can perform this action' })
    }

    user.password = undefined
    req.user = user

    next()
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Invalid token', error: error.message })
  }
}

module.exports = { isAuth, isAdmin }
