const cloudinary = require('cloudinary').v2

const deleteFile = (url) => {
  const imgSplit = url.split('/')
  const folderName = imgSplit.at(-2)
  const fileName = imgSplit.at(-1).split('.')[0]

  console.log(folderName, fileName)

  cloudinary.uploader.destroy(`${folderName}/${fileName}`, () => {
    console.log('File deleted successfully')
  })
}

module.exports = deleteFile
