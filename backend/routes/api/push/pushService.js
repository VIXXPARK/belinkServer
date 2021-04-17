const admin = require('firebase-admin');
const serAccount = require('../../../serviceKey.json');
const model = require('../../../models');
const { sequelize } = require('../../../models');

admin.initializeApp({
    credential: admin.credential.cert(serAccount)
});

exports.personalPush = async (req, res, senderId) => {
    try{
        //team_room은 같은 주제를 구독한 그룹에게 메시지를 보내기 위함임
        //storeId는 메시지 전송할때 data에 넣어서 모두 수락시 방문장소 위치 기록용도
        const target_token = ''; //푸시메시지를 받을 디바이스의 토큰

        const message = {
            notification: {
                title: 'test data send',
                body: 'personal??',
            },
            data:{
                storeId: '<--StoreId : uuid를 넣어줌-->'
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
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err
        })
    }
    
}

exports.groupPush = async (req, res, noti, data) => {
    const { team_room, userId, storeId } = req.body;
    
    try{
        const result = await model.Member.findAll({
            attributes: ['updatedAt'],
            where: { team_room: team_room },
            include: [{ model: model.User, as: 'teamMember', attributes: ['token'] }]
            // required: true = inner join
            // right: true = right outer join
        })
        const array = []
        for(let i=0; i< result.length; i++)
        {
            array.push(result[i].teamMember.token)
        }
        const registrationTokens = array
        // const registrationTokens = [
        //     '<--기기토큰-->'
        // ];

        const message = {
            notification: noti,
            data: data,
            tokens: registrationTokens,
        }

        admin
            .messaging()
            .sendMulticast(message)
            .then((response) => {

                console.log('Successfully sent message : ', response)
                
                if (response.failureCount > 0) {
                    const failedTokens = [];
                    response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(registrationTokens[idx]);
                    }
                    });
                    console.log('List of tokens that caused failures: ' + failedTokens);
                }

                return res.status(200).json({ success : true })
            })
            .catch( (err) => {
                console.log('Error Sending message : ', err)
                return res.status(400).json({ success : false })
            });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err
        })
    }
}