const model = require('../../../models');
const key = require('../../../key');

exports.showPlace = (req, res) => {
    model.Visit.findAll({
        attributes: [],
        where: { userId: req.body.userId },
        include: [{ model: model.Store }]
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
exports.savePlace = (req, res) => {
    model.Visit.create({
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