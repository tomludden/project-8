require('dotenv').config()
cors = require('cors')
const express = require('express')
const { connectDB } = require('./src/config/db')
const mainRouter = require('./src/api/routes/main')
const cloudinary = require('cloudinary').v2

const app = express()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

connectDB()
console.log('Database URL:', process.env.DB_URL)

app.use(express.json())
app.use(cors())

app.use('/api/v1', mainRouter)

app.listen(3000, () => {
  console.log('server running on http://localhost:3000')
})
