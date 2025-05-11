const mongoose = require('mongoose')

const artistSchema = new mongoose.Schema(
  {
    artist: { type: String, required: true },
    img: { type: String, required: true },
    paintings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Painting' }]

    /* paintings: [
      {
        type: String,
        required: true,
        enum: [
          'Vincent van Gogh',
          'Salvador Dalí',
          'Pablo Picasso',
          'Leonardo da Vinci',
          'Edvard Munch',
          'Grant Wood',
          'Johannes Vermeer',
          'Gustav Klimt',
          'Rembrandt',
          'Claude Monet',
          'Frida Kahlo',
          'Georges Seurat',
          'John Everett Millais',
          'Wassily Kandinsky'
        ]
      }
    ] */
  },
  { timestamps: true }
)

const Artist = mongoose.model('Artist', artistSchema, 'artists')

module.exports = Artist
