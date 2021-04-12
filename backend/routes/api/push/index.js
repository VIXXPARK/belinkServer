const router = require('express').Router()
const controller = require('./controller')
const middleware = require('./middleware')

router.post('/pushMsg', controller.pushMsg)
router.post('/accepted', middleware.isOk, controller.accept)
module.exports = router