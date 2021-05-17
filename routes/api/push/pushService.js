const admin = require('firebase-admin');
const serAccount = require('../../../serviceKey.json');
const model = require('../../../models');
const { sequelize } = require('../../../models');
const { Op } = require("sequelize");

admin.initializeApp({
    credential: admin.credential.cert(serAccount)
});

exports.storePush = async (req, res, number) => {
    try{
        const { team_room, storeId } = req.body;
        const result = await model.Store.findAll({
            attributes: ['token'],
            where: { id: storeId }
        })

        // const array = []
        // result.forEach((item, idx) => {
        //     result.push(item.token)
        // })
        // for(let i=0; i< result.length; i++)
        // {
        //     array.push(result[i])
        // }
        // const target_token = array;

        const target_token = result.token;

        const message = {
            notification: {
                title: `${number} 명이 입장했습니다.`,
                body: '입장 완료',
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
        // console.log(result);
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

exports.infectionPush = async (req, res) => {
    const { userId, name } = req.body;
    try {
        
        const team_rooms = await model.Member.findAll({
            attributes: ['team_room'],
            where: { team_member: userId }
        })
        const teamRoomArray = [];
        team_rooms.forEach((item, idx)=>{
            teamRoomArray.push(item.team_room);
        })

        //console.log(teamRoomArray);

        const result = await model.Member.findAll({
            attributes: [],
            where: { team_room: teamRoomArray },
            include: [{ model: model.User, as: 'teamMember', where: {id: { [Op.not]: userId }}, attributes: ['token'] }]
        })

        const infectArray = [];
        result.forEach((item, idx)=>{
            infectArray.push(item.teamMember.token);
        });
        //console.log(infectArray);
        
        const registrationTokens = infectArray

        const noti = {
            title: `${name} 님이 코로나에 확진되었습니다.`,
            body: '같이 있으셨던 분들께서는 자가 격리 해주시고, 빠른 시일 내에 가까운 선별 진료소를 찾아 코로나 검사를 받아주시기 바랍니다.'
        }

        const message = {
            notification: noti,
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

    } catch(err) {
        res.status(404).json({
            success: false,
            message: err
        })
    }
}