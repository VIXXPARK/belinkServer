const model = require('../../../models');
const { sequelize } = require('../../../models');
const pushService = require('./pushService');

exports.pushMsg1 = async (req, res, next) => {
    const { team_room, userId, storeId } = req.body;
    try{
        await model.Accept.update(
            {
                userId: userId,
                cnt: 0,
                accpeted: true
            },
            { where: { teamId : team_room }})

        pushService.groupPush(req, res, team_room, 'TEST', 'THIS IS TEST', '0');
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
        const cur = await model.Accept.findAll({ attributes: ['cnt', 'accepted', 'total'], where: { teamId: team_room }})

        if(cur[0].total == cur[0].cnt)
        {
            pushService.groupPush(req, res, team_room, '수락되었습니다', '방문지역에 등록되었습니다.', '1');
        }

    } catch (err) {
        res.status(404).json({
            success: false,
            message: err
        })
    }
}
exports.reject = async (req, res) => {
    const { team_room } = req.body;

    try{
        await model.Accept.update(
            { accepted: false },
            { where: { teamId : team_room }}
        )
        pushService.groupPush(req, res, team_room, '취소되었습니다', '누군가 거절하셨네요', '0');
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err
        })
    }
}

exports.seqCheck = async (req, res) => {
    const { team_room } = req.body;
    try{
        const result = await model.Member.findAll({
            attributes: ['updatedAt'],
            where: { team_room: team_room },
            include: [{ model: model.User, as: 'teamMember', attributes: ['username'] }]
            // required: true = inner join
            // right: true = right outer join
        })
        res.json({
            success: true,
            data: result
        })
        // const array = []
        // for(let i=0; i< result.length; i++)
        // {
        //     array.push(result[i].teamMember.username)
        // }
        // res.send(array)
    } catch (err) {

    }
}