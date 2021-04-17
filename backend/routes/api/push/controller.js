const model = require('../../../models');
const { sequelize } = require('../../../models');
const pushService = require('./pushService');

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

// 바뀐것

// 1. user 테이블에 token 컬럼 추가, 저장할 때 토큰 또한 받아야한다.
// 2. accept 테이블 새로 추가, makemember함수가 실행될 때 create한다.
// 3. push알림 추가 (그룹nfc, 수락, 거절)