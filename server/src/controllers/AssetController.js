/* eslint-disable no-restricted-globals */
const { getAssetById } = require('../services')

const controller = {}

/**
 * Gets an asset by id
 */
controller.getAsset = async (req, res, next) => {
  try {
    const { id } = req.query

    if (isNaN(id)) return res.status(400).send('id must be a number')

    const result = await getAssetById(id)
    return res.status(200).send(result)
  } catch (err) {
    return next(err)
  }
}

module.exports = controller
