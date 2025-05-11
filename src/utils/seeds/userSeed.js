require('dotenv').config()
const bcrypt = require('bcrypt')
const users = require('../../data/users')
const User = require('../../api/models/users')
const mongoose = require('mongoose')

const userSeedData = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('Connected to MongoDB!')

    const collectionExists = await mongoose.connection.db
      .listCollections({ name: 'users' })
      .toArray()

    const keepUserIds = [
      '68161176f57313443ce20393',
      '681611cef57313443ce20396',
      '681624f26a7edb61b3f9a7e9'
    ]

    if (collectionExists.length > 0) {
      await User.deleteMany({ _id: { $nin: keepUserIds } })
      console.log('All users deleted except the specified ones.')
    }

    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        userName: user.userName,
        password: await bcrypt.hash(user.password, 10),
        role: user.role || 'user'
      }))
    )

    const insertedUsers = await User.insertMany(hashedUsers)

    console.log('Users inserted')

    await mongoose.disconnect()
    console.log('Disconnected from MongoDB!')
  } catch (error) {
    console.error('Error seeding users:', error)
    await mongoose.disconnect()
  }
}

userSeedData()
