const router = require('express').Router()
const controller = require('./controller')

router.post('/signup',controller.register) //회원가입
router.post('/get-user',controller.getUser) //유저정보 확인하기
router.post('/contact-user',controller.contactUser)
router.post('/id-contact-user',controller.idContactUser)
router.post('/login',controller.login)      //jwt생성 및 로그인
router.post('/edit-team',controller.makeTeam)//그룹방 만들기
router.put('/edit-team',controller.editTeam) //그룹방 수정하기
router.delete('/delete-team',controller.deleteTeam)//그룹방 삭제하기
router.post('/make-member',controller.makeMember)// 그룹 구성원 추가하기
router.post('/edit-friend',controller.makeFriend)// 친구 목록 만들기
router.post('/get-my-friend',controller.getMyFriend) // 친구 목록 불러오기
router.put('/edit-info',controller.editUser)        //개인정보 수정하기
router.get('/edit-info/:id',controller.deleteUser)  //회원탈퇴
router.delete('/edit-memeber',controller.deleteMember)//멤버 삭제하기
router.post('/get-member',controller.getMember)//멤버 목록 가져오기
router.put('/infect-user',controller.infectUser)//감염환자시 infect true로 변경
module.exports = router