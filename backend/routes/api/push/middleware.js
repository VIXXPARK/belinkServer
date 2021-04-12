const model = require('../../../models');
const { sequelize } = require('../../../models');
const controller = require('./controller')

exports.isOk = async (req, res, next) => {
    const { team_room, isOk, userId, storeId } = req.body;
    if(isOk)
    {
        try{
            const total = await model.Member.count({ where:{ team_room: team_room }})
            const cur = await model.Accept.findAll({ attributes: ['cnt'] ,where: { teamId: team_room }})
            
            if( total == cur[0].cnt ){
                next();
            } else {
                try{
                    await model.Accept.update(
                        { cnt: sequelize.literal('cnt + 1')},
                        { where: { teamId : team_room }}
                    )
                    res.status(200).json({
                        success: true,
                        data: "+1!"
                    })

                    if( total == cur[0].cnt ) next(controller);

                } catch (err) {
                    console.error(err);
                    res.status(404).json({
                        success: false,
                        message: err
                    })
                }
            }
            
        } catch (err) {
            console.error(err);
            res.status(404).json({
                success: false,
                message: err
            })
        }

    } else {
        try{
            await model.Accept.update(
                { cnt: 0},
                { where: { teamId : team_room }}
            )
            res.status(200).json({
                success: true,
                data: "->0"
            })
        } catch (err) {
            console.error(err);
            res.status(404).json({
                success: false,
                message: err
            })
        }
    }
}