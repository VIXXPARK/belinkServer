const router = require('express').Router()
const controller = require('./controller')

router.post('/signup',controller.register)
router.post('/get-user',controller.getUser)
router.post('/login',controller.login)
router.post('/edit-team',controller.makeTeam)
router.put('/edit-team',controller.editTeam)
router.post('/make-member',controller.makeMember)
router.post('/edit-friend',controller.makeFriend)
router.post('/get-my-friend',controller.getMyFriend)
router.put('/edit-info',controller.editUser)
router.get('/edit-info/:id',controller.deleteUser)
router.delete('/edit-memeber',controller.deleteMember)
router.post('/get-member',controller.getMember)
router.put('/infect-user',controller.infectUser)
module.exports = router