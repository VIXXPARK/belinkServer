const router = require('express').Router()
const controller = require('./controller')

router.post('/visited-place-list',controller.showPlace)
router.post('/visited-place-save',controller.savePlace)
router.post('/search-places', controller.searchPlace)

module.exports = router