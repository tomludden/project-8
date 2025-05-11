const { isAuth, isAdmin } = require('../../middlewares/auth')

const upload = require('../../middlewares/file')

const {
  getPaintings,
  postPainting,
  updatePainting,
  deletePainting,
  getPaintingsUnverified,
  getPainting
} = require('../controllers/paintings')

const paintingRouter = require('express').Router()

paintingRouter.get('/:id', getPainting)
paintingRouter.get('/', getPaintings)
paintingRouter.get('/unverified', [isAdmin], getPaintingsUnverified)
paintingRouter.post('/', [isAuth], upload.single('img'), postPainting)
paintingRouter.put('/:id', [isAdmin], upload.single('img'), updatePainting)
paintingRouter.delete('/:id', [isAdmin], deletePainting)

module.exports = paintingRouter
