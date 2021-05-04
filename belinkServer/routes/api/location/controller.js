const model = require('../../../models');
const key = require('../../../key');

exports.showPlace = (req, res) => {
    model.Visit.findAll({where:{userId:req.body.userId}})
    .then(result => {
        if(!result) {
            return res.status(404).send({
                message:"방문한 곳이 없습니다."
            })
        }
        res.json({
            success: true,
            data: result
        })
    })
    .catch(err => {
        res.status(404).json({
            success: false,
            message: err
        })
    })
}
exports.savePlace = (req, res) => {
    model.Visit.create({
        infect: req.body.infect,
        userId: req.body.userId,
        storeId: req.body.storeId
    })
    .then(result => {
        res.json({
            success: true,
            data: result
        })
    })
    .catch(err => {
        res.status(404).json({
            success: false,
            message: err
        })
    })
}