const { isAdmin } = require('../../middlewares/auth')

const upload = require('../../middlewares/file')

const {
  getArtists,
  postArtist,
  updateArtist,
  deleteArtist,
  getArtist
} = require('../controllers/artists')

const artistRouter = require('express').Router()

artistRouter.get('/:id', getArtist)
artistRouter.get('/', getArtists)
artistRouter.post('/', [isAdmin], upload.single('img'), postArtist)
artistRouter.put('/:id', [isAdmin], upload.single('img'), updateArtist)
artistRouter.delete('/:id', [isAdmin], deleteArtist)

module.exports = artistRouter
