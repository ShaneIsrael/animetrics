const gm = require('gm')
const fs = require('fs')
const logger = require('../logger')


function resize(width, height, path) {
  // Simple checks to see if the value was passed in the url
  // If it wasn't, the value is changed from undefined to null
  width = width || null;
  height = height || null;

  gm(path)
    .resize(width, height)
    .write('./tmp.png', (err) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info('./tmp.png');
      }
    })

  //  fs.unlinkSync('./tmp.png');
}

function crop(width, height, path, savePath) {
  gm(path)
    .gravity('Center')
    .crop(width, height, 121, -140)
    .write('./tmp.png', (err) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info('./tmp.png');
      }
    })
}

crop(758, 140, '/Users/sisrael/Downloads/poster.jpg')
