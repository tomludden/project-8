const User = require('../models/users')
const bcrypt = require('bcrypt')
const { generateSign } = require('../../config/jwt')

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    )
    res.json(updatedUser)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

const register = async (req, res, next) => {
  try {
    const { userName, password } = req.body
    const newUser = new User({
      userName: req.body.userName,
      password: req.body.password,
      role: req.body.role
    })

    const duplicateUser = await User.findOne({ userName })
    if (duplicateUser) {
      return res
        .status(400)
        .json({ message: 'User already exists, choose another name' })
    }

    const savedUser = await newUser.save()
    return res.status(201).json(savedUser)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body

    const user = await User.findOne({ userName })

    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = generateSign(user._id)
      return res.status(200).json({ user, token })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const currentUser = req.user

    if (currentUser.role !== 'admin' && currentUser._id.toString() !== id) {
      return res
        .status(400)
        .json({ message: 'Forbidden: You can only delete your own account' })
    }
    const deletedUser = await User.findByIdAndDelete(id)
    return res.status(200).json({
      message: 'User deleted',
      user: deletedUser
    })
  } catch (error) {
    return res.status(400).json({ message: 'User not deleted' })
  }
}

module.exports = {
  getUsers,
  getUser,
  updateUser,
  register,
  login,
  deleteUser
}
