const router = require('express').Router()
const controller = require('./controller')
const model = require('../../../models')


console.log( __dirname );

router.get('/', function(req, res){
    res.render('startpage', {});
})
router.get('/signup-page', function(req, res){
    res.render('signup', {});
})
router.get('/getuser-page', function(req, res){
    res.render('getuser', {});
})
router.get('/user-page/:userid', async function(req, res){
    var info = await model.User.findOne({
        where: {
            id: req.params.userid
        }
    })
    res.render('edituser', {
        id: info.id,
        phNum: info.phNum,
        username: info.username
    });
})
/*
router.get('/edit-team-page', function(req, res){
    res.render('getuser', {});
})
*/
router.post('/make-team-page', async function(req, res){
    await model.Friend.findAll({
        raw: true,
        attributes:[],
        where:{device: req.body.id,
                hidden: 0},
        include:[
                {model:model.User,as:'myFriendUser',attributes:["id","phNum","username"]}]
    })
    .then(result=>{
        res.render('maketeam', {
            myId: req.body.id,
            friendInfo: result
        });
    })

});


router.post('/signup',controller.register)              //Checked
router.post('/get-user',controller.getUser)             //Checked
router.post('/login',controller.login)
router.post('/edit-team',controller.makeTeam)           //Checked
router.put('/edit-team',controller.editTeam)
router.post('/make-member',controller.makeMember)       //check makeTeam
router.post('/edit-friend',controller.makeFriend)
router.post('/get-my-friend',controller.getMyFriend)    //Checked
router.put('/edit-info',controller.editUser)            //Checked; postman으로 테스트
//router.post('/edit-info',controller.editUser)            //Checked; 웹으로 테스트 목적으로 임의로 put->post로 바꿔서 테스트(html form은 post랑 get만 지원)
router.get('/edit-info/:id',controller.deleteUser)      //Checked
router.delete('/edit-memeber',controller.deleteMember)
router.post('/get-member',controller.getMember)
router.put('/infect-user',controller.infectUser)

module.exports = router