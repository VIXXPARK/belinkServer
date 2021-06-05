const model = require('../../../models');
const { sequelize } = require('../../../models');
const pushService = require('./pushService');
const { Op } = require("sequelize");

exports.nfcPushMsg = async (req, res, next) => {
    const { team_room, userId, storeId } = req.body;
    try{
        await model.Accept.update(
            {
                userId: userId,
                cnt: 0,
            },
            { where: { teamId : team_room }})

        const noti = {
        }
        const data = {
            title: '그룹 nfc',
            body: '그룹 수락 요청입니다.',
            storeId: storeId,
            teamId: team_room,
            click_action: 'goActivity',
            isOk: '0'
        }

        pushService.groupPush(req, res, noti, data);
        
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "실패"
        })
    }
}

exports.accept = async (req, res, next) => {
    const { team_room, userId, storeId } = req.body;

    try{
        await model.Accept.update(
            { cnt: sequelize.literal('cnt + 1')},
            { where: { teamId : team_room }}
        )
        const cur = await model.Accept.findAll({ attributes: ['cnt', 'total'], where: { teamId: team_room }})
        
        const noti = {

        }
        const data = {
            title: '완료되었습니다.',
            body: '방문기록 작성이 완료되었습니다.',
            storeId: storeId,
            teamId: team_room,
            click_action: 'MainActivity',
            isOk: '1'
        }
        if(cur[0].total == cur[0].cnt)
        {
            pushService.acceptPush(req, res, noti, data, cur[0].total);
            
        } else {
            res.json({
                success: true,
                data: '수락완료'
            })
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            message: '전송실패'
        })
    }
}
exports.reject = async (req, res) => {
    const { team_room } = req.body;
    try{
        const noti = {}
        const data = {
            title: '취소되었습니다.',
            body: '거절되었습니다.',
            storeId: '',
            teamId: team_room,
            click_action: 'MainActivity',
            isOk: '0'
        }
        pushService.groupPush(req, res, noti, data);
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err
        })
    }
}

exports.groupInfectionPush = async (req, res) => {
    try{
        pushService.infectionPush(req, res);
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err
        })
    }
}

exports.test = async(req, res) => {
    const { team_room, storeId } = req.body;
    try{
        const r = await model.Member.findAll({
            attributes: ['team_member'],
            where: { team_room: team_room }
        })

        var jsonArray = new Array();
        for (var i=0; i<r.length; i++) {
            var jsonObj = new Object();
                
            jsonObj.userId = r[i].team_member;                
            jsonObj = JSON.stringify(jsonObj);
            //String 형태로 파싱한 객체를 다시 json으로 변환
            jsonArray.push(JSON.parse(jsonObj));
        }
        console.log(jsonArray);
        await model.Visit.bulkCreate(
            jsonArray)

        res.json({
            success : true,
            message : jsonArray
        })

        
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err
        })
    }
}