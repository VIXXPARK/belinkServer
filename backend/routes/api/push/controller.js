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
    const { team_room } = req.body;

    try{
        await model.Accept.update(
            { cnt: sequelize.literal('cnt + 1')},
            { where: { teamId : team_room }}
        )
        const cur = await model.Accept.findAll({ attributes: ['cnt', 'total'], where: { teamId: team_room }})

        if(cur[0].total == cur[0].cnt)
        {
            const noti = {
                title: '완료되었습니다.',
                body: '방문기록 작성이 완료되었습니다.'
            }
            const data = {
                isOk: 'true'
            }
            pushService.groupPush(req, res, noti, data);
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
    const { userId, name } = req.body;
    try{
        const team_rooms = await model.Member.findAll({
            attributes: ['team_room'],
            where: { team_member: userId }
        })
        const teamRoomArray = [];
        team_rooms.forEach((item, idx)=>{
            teamRoomArray.push(item.team_room);
        });

        console.log(teamRoomArray);
        console.log("check1");
        const result = await model.Member.findAll({
            attributes: [],
            where: { team_room: teamRoomArray },
            include: [{ model: model.User, as: 'teamMember', where: {id: { [Op.not]: userId }}, attributes: ['token'] }]
        })
        console.log("check2");
        const infectArray = [];
        result.forEach((item, idx)=>{
            infectArray.push(item.teamMember.token);
        });
        console.log(infectArray);

        res.json({
            success: true,
            message: infectArray
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err
        })
    }
}