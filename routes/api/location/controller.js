const model = require('../../../models')
require('dotenv').config();
const env = process.env;
const requestApi = require('request');

exports.showPlace = (req, res) => {
    var allVisits = [];
    model.Visit.findAll({
        attributes: [],
        where: { userId: req.body.userId },
        include: [{ model: model.Store }]
    })
    .then(result => {
        result.forEach(cur => {
            allVisits.push(cur)
        })
    })
    .then(() => {
        model.pendingVisit.findAll({
            attributes: [],
            where: {
                userId: req.body.userId
            },
            include: [{model: model.Store}]
        }).then(resultB => {
            resultB.forEach(cur => {
                allVisits.push(cur)
            })
        }).then(() => {
            res.status(200).json({
                success: true,
                data: allVisits
            })
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

exports.pendingVisits = (req, res) => {
    model.User.findOne({
        where: {
            id: req.body.userId
        }
    }).then(result => {
        model.pendingVisit.create({
            userId: req.body.userId,
            phNum: result.phNum,
            storeId: req.body.storeId
        }).then(resultB => {
            res.json({
                result: resultB
            })
        })
    }).catch(err => {
        res.json({
            error: "Unavailable User"
        })
    })
}

exports.searchPlace = (req, res) => {
    const keyword = req.body.keyword;
    var kUrl = '';
    const kMethod = 'GET';
    const kHeaders = {
        'Authorization': 'KakaoAK c9f67cf11819f1c1e3c318b99d7dfac1'
    }
    const kEncoding = 'utf-8';

    kUrl = encodeURI("https://dapi.kakao.com/v2/local/search/keyword.json?page=1&size=15&sort=accuracy&query="+keyword);

    let kakaoOptions = {
        uri: kUrl,
        method: kMethod,
        headers: kHeaders,
        encoding: kEncoding
    }

    requestApi(kakaoOptions, async function(err, apiRes, body){
        if(err){
            res.json({
                data: "err"
            })
        }
        else{
            var parsedBody = JSON.parse(body);
            res.json({
                data:parsedBody['documents']
            })
        }
    })
}