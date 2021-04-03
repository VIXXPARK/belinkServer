const router = require('express').Router()
const controller = require('./controller')

router.post('/signup',controller.register)
router.post('/get-user',controller.getUser)
router.post('/edit-group',controller.makeGroup)
router.post('/make-member',controller.makeMember)

module.exports = router