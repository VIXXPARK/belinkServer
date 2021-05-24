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
            // title: '그룹 nfc',
            // body: '그룹 수락 요청입니다.'
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
    const { team_room, storeId } = req.body;

    try{
        await model.Accept.update(
            { cnt: sequelize.literal('cnt + 1')},
            { where: { teamId : team_room }}
        )
        const cur = await model.Accept.findAll({ attributes: ['cnt', 'total'], where: { teamId: team_room }})
        
        const noti = {
            // title: '완료되었습니다.',
            // body: '방문기록 작성이 완료되었습니다.'
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
            // title: '취소되었습니다.',
            // body: '거절되었습니다.'
        }
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
        console.log(array);
        res.json({
            success: true,
            message: array
        })
        // const team_rooms = await model.Member.findAll({
        //     attributes: ['team_room'],
        //     where: { team_member: userId }
        // })
        // const teamRoomArray = [];
        // team_rooms.forEach((item, idx)=>{
        //     teamRoomArray.push(item.team_room);
        // });

        // console.log(teamRoomArray);
        // const result = await model.Member.findAll({
        //     attributes: [],
        //     where: { team_room: teamRoomArray },
        //     include: [{ model: model.User, as: 'teamMember', attributes: ['id','username', 'token'] }]
        // })
        // const infectArray = [];
        // result.forEach((item, idx)=>{
        //     if(item.teamMember.id != userId)
        //         infectArray.push(item.teamMember.username);
        // });
        // console.log(infectArray);

        // res.json({
        //     success: true,
        //     message: result
        // })
        
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err
        })
    }
}