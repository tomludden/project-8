const artistRouter = require('./artists')
const paintingRouter = require('./paintings')
const userRoutes = require('./users')

const mainRouter = require('express').Router()

mainRouter.use('/artists', artistRouter)
mainRouter.use('/paintings', paintingRouter)
mainRouter.use('/users', userRoutes)

module.exports = mainRouter
