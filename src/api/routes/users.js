const userRoutes = require('express').Router()

const { isAdmin } = require('../../middlewares/auth')

const {
  getUsers,
  getUser,
  updateUser,
  register,
  login
} = require('../controllers/users')

userRoutes.get('/', [isAdmin], getUsers)
userRoutes.get('/:id', [isAdmin], getUser)
userRoutes.put('/:id', [isAdmin], updateUser)
userRoutes.post('/register', register)
userRoutes.post('/login', login)

module.exports = userRoutes
