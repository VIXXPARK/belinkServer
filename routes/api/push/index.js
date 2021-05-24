const router = require('express').Router()
const controller = require('./controller')

router.post('/nfcPushMsg', controller.nfcPushMsg)
router.post('/accepted', controller.accept)
router.get('/rejected', controller.reject)
router.post('/infectionPush', controller.groupInfectionPush)
router.post('/test', controller.test)
module.exports = router