const router = require('express').Router()
const controller = require('./controller')

router.post('/pushMsg', controller.pushMsg1)
router.post('/accepted', controller.accept)
router.post('/rejected', controller.reject)
//router.post('/seqCheck', controller.seqCheck)
module.exports = router