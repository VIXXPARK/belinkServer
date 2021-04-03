const router = require('express').Router()
const controller = require('./controller')

router.post('/signup',controller.register)
router.post('/get-user',controller.getUser)
router.post('/edit-group',controller.makeGroup)
router.post('/make-member',controller.makeMember)
router.post('/edit-friend',controller.makeFriend)
router.post('/get-my-friend',controller.getMyFriend)
module.exports = router