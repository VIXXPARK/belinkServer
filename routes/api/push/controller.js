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
                //accpeted: true
            },
            { where: { teamId : team_room }})

        const noti = {
            title: '그룹 nfc',
            body: '그룹 수락 요청입니다.'
        }
        const data = {
            storeId: storeId
        }

        pushService.groupPush(req, res, noti, data);

    } catch (err) {
        res.status(404).json({
            success: false,
            message: err
        })
    }
}

exports.accept = async (req, res, next) => {
    const { team_room, storeId } = req.body;

    try{
        await model.Accept.update(
            { cnt: sequelize.literal('cnt + 1')},
            { where: { teamId : team_room }}
        )
        const cur = await model.Accept.findAll({ attributes: ['cnt', 'total'], where: { teamId: team_room }})
        
        const noti = {
            title: '완료되었습니다.',
            body: '방문기록 작성이 완료되었습니다.'
        }
        const data = {
            storeId: 'storeId',
            isOk: 'true'
        }

        if(cur[0].total == 1)
        {
            pushService.storePush(req, res, cur[0].total);
        }
        else if(cur[0].total == cur[0].cnt)
        {
            
            pushService.groupPush(req, res, noti, data);
            pushService.storePush(req, res, cur[0].total);
            
        } else {
            res.json({
                success: true,
                data: '수락완료'
            })
        }

    } catch (err) {
        res.status(404).json({
            success: false,
            message: '전송실패'
        })
    }
}
exports.reject = async (req, res) => {
    const { team_room } = req.body;

    try{
        // await model.Accept.update(
        //     { accepted: false },
        //     { where: { teamId : team_room }}
        // )
        const noti = {
            title: '취소되었습니다.',
            body: '거절되었습니다.'
        }
        const data = {
            isOk : 'false'
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
    const { storeId } = req.body;
    try{
        const result = await model.Store.findAll({
            attributes: ['token'],
            where: { id: storeId }
        })
        console.log(result[0].token);

        res.json({
            success: true,
            message: result
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err
        })
    }
}