const admin = require('firebase-admin');
// const serAccount = require('../../../serviceKey.json');
const serAccount = {
    "type": process.env.TYPE,
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDVpWRdYkRE6no6\nivcPKf9ABOaxjwa4o7B5Zpnx3h//WHeMkFRggjeTOSxAVa5heD29GEKmUIeO/eRf\nqbOnnlwtox93WKYIZs5tHWYw1a9fMqjS2rEbiiBLbW8a0urwWWFhpqMqKjNgJdeN\nx+N/dPR6Mae7mdsvWaDmOfkKOQrKc3lDkkVjI2M1XJx8uzXSVBOQlhX4JaJNIsa8\n0Yr5PGytMmiwBrL92eBXgUWuvVycXe57h7MhjZZN3y3c0XiPa0zNeEtCaIf4oLpL\npsjLpVtyfKwYI6a82eVso6mLYQNZOB5WFdotu681zOOhvDCGicLYy8R4a8XcU3GO\nZAb/XUN/AgMBAAECggEAANjXhYaYC7KRn9LLjkwAfudQvNUlgII8TGGWQam7nxO2\n4Z/0MwUWevxyivdr/2dDzhCfDwa/CteXL16TtO9BS/hbbb80ZVB3CA1iSYDyDDgT\nXZv6sMfC6gRPOPWAyJ7Uw9eDym0sEqOub5micsUVb7iWWCg7gLwOZxXwFqoe5f+T\nrkaKQbybtVEDr5XO3joG77vn03818kvcvO+4gg7gOzFl/TDmx4Hqs4J5lXjsMZ//\nX1Tyof6Kml/7AkqfVyvCquVnjhUNmJc0e1Yb3jHwYUcR2+1LJ2Saxi68PcNqEn0J\nchvWrD2jxijWfajstBweDHlbP6coFXi7zMxaRUKdgQKBgQD2gYe1bHojjKXgvdA3\n30EXxYv8KPtv28bEwCmiOt2BcobyQ+gregUgIyYND9sIF0f3DOXXKQqmelphvajz\nAQo28LBKsWkbKUNYDHDykh2DQJDwsxVWJF8oV36EkgcYR2pqznW0vTYiUsYbsaMV\neVsDBV9CdE9F2V9VNY4GBHeH/wKBgQDd39+sGUcbR3KVtzTEcUn/JgCEeeeVngxV\nRkL53/vH200xM+difmIXorHUq4WNngViVdmPgcgi+jCCSeMYj8H2gjtTAwQC6yXP\nZ4QgecMMsTs89T6DJuvgmNSX67uepP2M9i+M+fvt95s9rVlIAq9/CbS0QSA1K7FW\nxgxJ8P5EgQKBgCDB48vbJ3vz49Myxim2lErZaJnQxGD//rEErEOvuOHL21z0YzTr\n2SSFJzhTJBM2LM0KvLxT6uNmnP4iGwJ33+ifIX47hzEh0Z4wwQ2rFxrrCJfD5JD2\n8mJFBj4Nvb2fN+gLmZ60Ci6Te1oQyBBBeTO0kg0dsa8hjMahAEeSbmP3AoGASxVR\nugmr2H1rN2MSRlAYPHH9xtcCGc2sWsc2Lx0vNUjvbHEmIlymkV0LVO7eeTg6ljZ7\nM2c19TA5bj3Wzh8IAoW70bG5j8tHtlJPkjXiXc80PsK3buai+BSADRFHIr6u1x8Q\npGKMcNFUBaE+D3JpNVJxhnZrkdLBZp4K1pLpWQECgYA0sbC8PU8U1WrIw56CECE2\nAEWO0aGn8hE2gIyiRv1eumu095TlVhsoWHWZXHYxhSCSJWhR7Yw0u1mDBcSjTzKL\nx0YQsKZjQq8EQf775ZeqH9vg1pwYwX4/qjkkHPgJrwLuwfuXuPaKmfuJlE50y/9h\nyqhpYyvMDmMy2/CIAzXePQ==\n-----END PRIVATE KEY-----\n",
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URL,
    "token_uri": process.env.TOKEN_URL,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
  }
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
            raw:true,
            where: { team_room: team_room },
            include: [{ model: model.User, as: 'teamMember', attributes: ['token'] }]
            // required: true = inner join
            // right: true = right outer join
        })
        //console.log(result);
        const array = []
        
        for(const cur of result){
            array.push(cur['teamMember.token']);
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

exports.storePush = async (req, res, number) => {
    const { team_room, storeId } = req.body;
    try{
        const result = await model.Store.findAll({
            attributes: ['token'],
            where: { id: storeId }
        })
        //console.log(result);
        // const array = []
        // result.forEach((item, idx) => {
        //     result.push(item.token)
        // })
        // for(let i=0; i< result.length; i++)
        // {
        //     array.push(result[i])
        // }
        // const target_token = array;

        const target_token = result[0].token;

        const message = {
            notification: {
                // title: `${number} 명이 입장했습니다.`,
                // body: '입장 완료',
            },
            data:{
                title: `${number} 명이 입장했습니다.`,
                body: '입장 완료',
                storeId: '',
                teamId: '',
                click_action: '',
                isOk: '1'
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

        // const result = await model.Member.findAll({
        //     attributes: [],
        //     where: { team_room: teamRoomArray },
        //     include: [{ model: model.User, as: 'teamMember', attributes: ['token'] }]//, where: {id: { [Op.not]: userId }}
        // })

        const result = await model.Member.findAll({
            attributes: [],
            where: { team_room: teamRoomArray },
            include: [{ model: model.User, as: 'teamMember', attributes: ['id', 'token'] }]
        })

        const infectArray = [];
        // result.forEach((item, idx)=>{
        //     infectArray.push(item.teamMember.token);
        // });
        result.forEach((item, idx)=>{
            if(item.teamMember.id != userId)
                infectArray.push(item.teamMember.token);
        });
        
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

exports.predictPush = async (req, res) => {
    const { storeId } = req.body;
    let Date = new Date();
    try{
        const result = await model.Store.findAll({
            attributes: ['storeName', 'token'],
            where: { id: storeId }
        })

        const target_token = result[0].token;

        const message = {
            notification: {
                title: 'Be-Link 앱 알림',
                body: `${result[0].storeName}
                        ${Date}`,
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

exports.acceptPush = async (req, res, noti, data, number) => {
    const { team_room, userId, storeId } = req.body;

    try{
        const result = await model.Member.findAll({
            raw:true,
            where: { team_room: team_room },
            include: [{ model: model.User, as: 'teamMember', attributes: ['token'] }]
        })
        const result2 = await model.Store.findAll({
            attributes: ['token'],
            where: { id: storeId }
        })
        //console.log(result);

        const array = []
        for(const cur of result){
            array.push(cur['teamMember.token']);
        }
        //console.log(array);
        const registrationTokens = array

        const message = {
            notification: noti,
            data: data,
            tokens: registrationTokens,
        }

        const storeToken = result2[0].token;
        //console.log(storeToken);
        const message2 = {
            notification: {
                // title: `${number} 명이 입장했습니다.`,
                // body: '입장 완료',
            },
            data:{
                title: `${number} 명이 입장했습니다.`,
                body: '입장 완료'
            },
            token: storeToken
        }

        admin
            .messaging()
            .sendMulticast(message)
            .then(async (response) => {
                await admin.messaging().send(message2)
                
                const r = await model.Member.findAll({
                    attributes: ['team_member'],
                    where: { team_room: team_room }
                })
        
                var jsonArray = new Array();
                for (var i=0; i<r.length; i++) {
                    var jsonObj = new Object();
                        
                    jsonObj.userId = r[i].team_member;  
                    jsonObj.storeId = storeId;              
                    jsonObj = JSON.stringify(jsonObj);
                    //String 형태로 파싱한 객체를 다시 json으로 변환
                    jsonArray.push(JSON.parse(jsonObj));
                }
                await model.Visit.bulkCreate(
                    jsonArray)
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