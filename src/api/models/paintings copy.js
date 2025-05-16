const mongoose = require('mongoose')

const paintingSchema = new mongoose.Schema(
  {
    painting: { type: String, required: true },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true
    },
    img: { type: String, required: true },
    year: { type: Number, required: true },
    category: [
      {
        type: String,
        required: true,
        enum: [
          'Post-Impressionism',
          'Surrealism',
          'Cubism',
          'Renaissance',
          'Expressionism',
          'Modernism',
          'Baroque',
          'Symbolism',
          'Impressionism',
          'Pointillism',
          'Pre-Raphaelite',
          'Abstract'
        ]
      }
    ],
    verified: { type: Boolean, required: true, default: false }
  },
  { timestamps: true }
)

paintingSchema.index({ album: 1, artist: 1 }, { unique: true })

const Painting = mongoose.model('Painting', paintingSchema, 'paintings')

module.exports = Painting
