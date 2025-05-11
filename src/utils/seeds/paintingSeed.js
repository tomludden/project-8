const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const Painting = require('../../api/models/paintings')
const paintings = require('../../data/paintings')
const Artist = require('../../api/models/artists')

const paintingSeedData = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('Connected to MongoDB!')

    const collectionExists = await mongoose.connection.db
      .listCollections({ name: 'paintings' })
      .toArray()
    if (collectionExists.length > 0) {
      await Painting.collection.drop()
      console.log('Painting collection dropped!')
    }

    for (let painting of paintings) {
      const artistName = await Artist.findOne({ artist: painting.artist })

      if (!artistName) {
        console.warn(
          `No artist found for "${painting.painting}" (artist: ${painting.artist})`
        )
        continue
      }

      const existingPainting = await Painting.findOne({
        painting: painting.painting
      })
      if (existingPainting) {
        console.log(`Painting "${painting.painting}" already exists`)
        continue
      }

      const newPainting = await Painting.create({
        ...painting,
        artist: artistName._id
      })

      await Artist.findByIdAndUpdate(
        artistName._id,
        { $addToSet: { paintings: newPainting._id } },
        { new: true }
      )

      console.log(
        `Linked "${newPainting.painting}" to artist "${artistName.artist}"`
      )
    }

    const populatedPaintings = await Painting.find().populate({
      path: 'artist',
      select: 'artist'
    })

    await mongoose.disconnect()
    console.log('Disconnected from MongoDB!')
  } catch (error) {
    console.error('Error seeding paintings:', error)
    await mongoose.disconnect()
  }
}

paintingSeedData()
