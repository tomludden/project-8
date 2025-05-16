const Painting = require('../models/paintings')
const Artist = require('../models/artists')

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
    const { painting, img, year, category, artist: artistName } = req.body

    if (!artistName) {
      return res.status(400).json({ message: 'Artist name is required' })
    }
    if (req.user.role === 'admin') {
      newPainting.verified = true
    } else {
      newPainting.verified = false
    }

    const foundArtist = await Artist.findOne({
      artist: { $regex: new RegExp(`^${artistName}$`, 'i') }
    })

    if (!foundArtist) {
      return res.status(404).json({ message: 'Artist not found' })
    }

    const newPainting = new Painting({
      painting,
      img,
      year,
      category,
      artist: foundArtist._id
    })

    const savedPainting = await newPainting.save()

    if (!foundArtist.paintings.includes(savedPainting._id)) {
      foundArtist.paintings.push(savedPainting._id)
      await foundArtist.save()
    }

    return res.status(201).json(savedPainting)
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Painting not saved', error: error.message })
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
