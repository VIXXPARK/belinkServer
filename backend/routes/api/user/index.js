const router = require('express').Router()
const controller = require('./controller')

router.post('/signup',controller.register)
router.post('/get-user',controller.getUser)

module.exports = router