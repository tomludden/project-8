const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const Artist = require('../../api/models/artists')
const artists = require('../../data/artists')

const artistSeedData = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('Connected to MongoDB!')

    const collectionExists = await mongoose.connection.db
      .listCollections({ name: 'artists' })
      .toArray()
    if (collectionExists.length > 0) {
      await Artist.collection.drop()
      console.log('Artist collection dropped!')
    }

    const insertedArtists = await Artist.insertMany(
      artists.map((artist) => ({
        artist: artist.artist,
        img: artist.img,
        paintings: []
      }))
    )

    console.log('Artists inserted:')
    insertedArtists.forEach((a) => console.log(`- ${a.artist}`))

    await mongoose.disconnect()
    console.log('Disconnected from MongoDB!')
  } catch (error) {
    console.error('Error seeding artists:', error)
    await mongoose.disconnect()
  }
}

artistSeedData()
