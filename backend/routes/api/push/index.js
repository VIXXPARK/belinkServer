const router = require('express').Router()
const controller = require('./controller')

router.post('/nfcPushMsg', controller.nfcPushMsg)
router.post('/accepted', controller.accept)
router.post('/rejected', controller.reject)

module.exports = router