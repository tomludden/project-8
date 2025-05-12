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

    const keepUserId = ['682231f7f3ec7c58aa9fe568']

    if (collectionExists.length > 0) {
      await User.deleteMany({ _id: { $nin: keepUserId } })
      console.log('All users deleted except the specified ones.')
    }

    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        username: user.username,
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
