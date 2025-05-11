const Painting = require('../models/paintings')

const deleteFile = require('../../utils/deleteFile')

const getPaintings = async (req, res, next) => {
  try {
    const paintings = await Painting.find({ verified: true }).populate(
      'artist',
      'artist'
    )
    return res.status(200).json(paintings)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const getPaintingsUnverified = async (req, res, next) => {
  try {
    const paintings = await Painting.find({ verified: false }).populate(
      'artist',
      'artist'
    )
    return res.status(200).json(paintings)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const getPainting = async (req, res, next) => {
  try {
    const { id } = req.params
    const painting = await Painting.findById(id).populate('artist', 'artist')
    return res.status(200).json(painting)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const postPainting = async (req, res, next) => {
  try {
    const newPainting = new Painting(req.body)

    if (req.file) {
      console.log(req.file)
      newPainting.img = req.file.path
    }

    if (req.user.role === 'admin') {
      newPainting.verified = true
    } else {
      newPainting.verified = false
    }

    const paintingSaved = await newPainting.save()
    return res.status(201).json(paintingSaved)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const updatePainting = async (req, res, next) => {
  try {
    const { id } = req.params
    const newPainting = new Painting(req.body)
    newPainting._id = id

    if (req.file) {
      newPainting.img = req.file.path
      const oldPainting = await Painting.findById(id)
      deleteFile(oldPainting.img)
    }

    const paintingUpdated = await Painting.findByIdAndUpdate(id, newPainting, {
      new: true
    })

    return res.status(200).json(paintingUpdated)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const deletePainting = async (req, res, next) => {
  try {
    const { id } = req.params
    const paintingDeleted = await Painting.findByIdAndDelete(id)
    deleteFile(paintingDeleted.img)
    return res.status(200).json({ message: 'Painting deleted' })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getPaintings,
  postPainting,
  updatePainting,
  deletePainting,
  getPaintingsUnverified,
  getPainting
}
