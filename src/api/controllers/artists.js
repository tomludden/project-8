const Artist = require('../models/artists')

const deleteFile = require('../../utils/deleteFile')

const getArtists = async (req, res, next) => {
  try {
    const artists = await Artist.find().populate(
      'paintings',
      'painting img year category'
    )
    return res.status(200).json(artists)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const getArtist = async (req, res, next) => {
  try {
    const { id } = req.params
    const artist = await Artist.findById(id).populate(
      'paintings',
      'painting img year category'
    )
    return res.status(200).json(artist)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const postArtist = async (req, res, next) => {
  try {
    const newArtist = new Artist(req.body)
    if (req.file) {
      newArtist.img = req.file.path
    }
    const artistSaved = await newArtist.save()
    return res.status(201).json(artistSaved)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const updateArtist = async (req, res, next) => {
  try {
    const { id } = req.params
    const oldArtist = await Artist.findById(id)
    if (!oldArtist) {
      return res.status(400).json({ message: 'Artist not found' })
    }

    const updatedFields = { ...req.body }

    if (req.body.paintings) {
      updatedFields.paintings = [...oldArtist.paintings, ...req.body.paintings]
    }

    if (req.file) {
      updatedFields.img = req.file.path
      if (oldArtist.img) {
        deleteFile(oldArtist.img)
      }
    }

    const artistUpdated = await Artist.findByIdAndUpdate(id, updatedFields, {
      new: true
    })

    return res.status(200).json(artistUpdated)
  } catch (error) {
    return res.status(400).json({ message: "Couldn't update artist" })
  }
}

const deleteArtist = async (req, res, next) => {
  try {
    const { id } = req.params
    const artistDeleted = await Artist.findByIdAndDelete(id)
    deleteFile(artistDeleted.img)
    return res.status(200).json({ message: 'Artist deleted' })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getArtists,
  postArtist,
  updateArtist,
  deleteArtist,
  getArtist
}
