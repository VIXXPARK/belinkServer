const model = require('../../../models');
const admin = require('firebase-admin');
const serAccount = require('../../../serviceKey.json');
const { sequelize } = require('../../../models');

admin.initializeApp({
    credential: admin.credential.cert(serAccount)
});

exports.pushMsg = (req, res, next) => {
    const { nfcActivated, team_room, storeId } = req.body;
    //team_room은 같은 주제를 구독한 그룹에게 메시지를 보내기 위함임
    //storeId는 메시지 전송할때 data에 넣어서 모두 수락시 방문장소 위치 기록용도
    if(nfcActivated)
    {
        let target_token = 'ekA0s7dITHuW5Qb3MfqVRg:APA91bFW1tux1vyGhU49Xs28I0N4_C2GsDFvfZ6a8gw-SMid_dAbg-UWpnXIadJ6Z0nYJ2PCOK4jJhxilzwfR-7KYGiEYsEYVDDSe_O9aDb9_PUvy8AjbRweNSgzYP91x1aG1dtt9p_9'; //푸시메시지를 받을 디바이스의 토큰

        let message = {
            notification: {
                title: 'test data send',
                body: 'data??',
            },
            data:{
              body: '<--StoreId : uuid를 넣어줌-->'
            },
            token: target_token
            
        }
        
        admin
            .messaging()
            .send(message)
            .then( (response) => {
                console.log('Successfully sent message : ', response)
                return res.status(200).json({ success : true })
            })
            .catch( (err) => {
                console.log('Error Sending message : ', err)
                return res.status(400).json({ success : false })
            });
    } else {
        res.status(400).json({ success : false })
    }
}

exports.accept = async (req, res, next) => {
    const { team_room, isOk, userId, storeId } = req.body;

    try{
        const result = await model.Visit.create({
            userId: userId,
            storeId: storeId
        })
        return res.json({
            success: true,
            data: result
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err
        })
    }
}