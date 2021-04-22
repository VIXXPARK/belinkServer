const router = require('express').Router()
const controller = require('./controller')

router.get('/visited-place-list',controller.showPlace)
router.post('/visited-place-save',controller.savePlace)

module.exports = router