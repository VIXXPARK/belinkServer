const requestApi = require('request');
const express = require("express");
const fs = require('fs');
const Json2csvParser = require("json2csv").Parser;
const {PythonShell} = require('python-shell');

const model = require('../../models/index')
const { Sequelize } = require('sequelize');
const sequelize = require('sequelize');
const store = require('../../models/store');
const Op = Sequelize.Op;


exports.getPrediction = async (req, res, next) => {
    const curX = req.body.x;
    const curY = req.body.y;
    const id = req.body.id;
    const radius = 100;
    
    let ts = Date.now() + 32400000; //Date.now()는 UTC 기준; 한국은 UTC+9hours; 9 hours == 32400000 ms
    let dateObj = new Date(ts);
    let hour = dateObj.getHours();
    let day = dateObj.getDay();


    var getPrior = await model.Visit.findOne({
        raw: true,
        include:[{
            model: model.Store
        }],
        where:{
            userId: id,
            [Op.and]: [
                sequelize.where(
                    sequelize.fn('TIMEDIFF',dateObj,sequelize.col('visit.createdAt')),{
                        [Op.lte]: '03:00:00',
                        [Op.gt]: '00:00:01'
                    }
                )
            ]
        },
        order:[
            ['createdAt', 'DESC']
        ]
    });
    var myPrior = ""
    if(getPrior == null){
        myPrior = "none";
    }
    else{
        myPrior = getPrior['store.storeType'];
    }

    var testUri;
    var kUrl = '';
    const kMethod = 'GET';
    const kHeaders = {
        'Authorization': 'KakaoAK c9f67cf11819f1c1e3c318b99d7dfac1'
    }
    const kEncoding = 'utf-8';

    await model.treeResult.findAll({
        raw: true,
        attributes:['storeType'],
        where:{
            sTime:{
                [Op.lte]: hour
            },
            dTime:{
                [Op.gt]: hour
            },
            sDay:{
                [Op.lte]: day
            },
            dDay:{
                [Op.gte]: day
            },
            prior: myPrior
        }
    }).then(result => {
        if(result != undefined){
            const predictedStore = result[0]['storeType'];
            if(predictedStore == 'CE7' || predictedStore == 'FD6'){
                kUrl = "https://dapi.kakao.com/v2/local/search/category.json?category_group_code="+predictedStore+"&page=1&size=15&sort=distance&radius="+radius+"&x="+curX+"&y="+curY;
            }
            else{
                var storeKeyword = '';
                if(predictedStore == 'KAR'){
                    storeKeyword = "노래방";
                }
                else if(predictedStore == 'THM'){
                    storeKeyword = "테마카페";
                }
                else if(predictedStore == 'PC'){
                    storeKeyword = "PC방";
                }
                else if(predictedStore == 'TH1'){
                    storeKeyword = "영화관";
                }
                else if(predictedStore == 'TH2'){
                    storeKeyword = "연극극장";
                }
                kUrl = encodeURI("https://dapi.kakao.com/v2/local/search/keyword.json?page=1&size=15&sort=accuracy&x="+curX+"&y="+curY+"&query="+storeKeyword);
            }
        }
        else{
            kUrl = "https://dapi.kakao.com/v2/local/search/category.json?category_group_code=CE7&page=1&size=15&sort=distance&radius="+radius+"&x="+curX+"&y="+curY;
        }
        testUri = kUrl;

    })


    let kakaoOptions = {
        uri: kUrl,
        method: kMethod,
        headers: kHeaders,
        encoding: kEncoding
    }
    
    
    await requestApi(kakaoOptions, async function(err, apiRes, body){
        if(err){
            res.json({
                data: "err"
            })
        }
        else{
            getCnt(body);
        }
    })

    
    function getCnt(body){
        var parsedBody = JSON.parse(body);
        var places = parsedBody['documents'];
        var finalStores = [];
        var flag = 0
        for(const cur of places){
            model.Visit.findAndCountAll({
            //SELECT id,createdAt,updatedAt,storeId,userId,count(*) FROM visits WHERE TIMEDIFF(${dateObj},createdAt) BETWEEN "00:00:01" AND "01:00:00" AND storeId=${cur.id}  GROUP BY storeId;
                raw: true,
                where:{
                    storeId: cur.id,
                    [Op.and]: [
                        sequelize.where(
                            sequelize.fn('TIMEDIFF',dateObj,sequelize.col('visit.createdAt')),{
                                [Op.lte]: '01:00:00',
                                [Op.gt]: '00:00:01'
                            }
                        )
                    ]
                },
                group: "storeId"
            }).then(result => {
                flag += 1
                if(result.count.length != 0){
                    cur['realTime'] = result.count[0]['count'];
                }
                else{
                    cur['realTime'] = 0;
                }
                finalStores.push(cur);

            }).then(resultB => {
                if(flag == places.length){
                    res.json({
                        data:finalStores
                    })
                }
            })
        }
    }        
}

exports.makePrediction = async (req, res, next) => {
    const getView = await model.useableVisit.findAll({
        attributes:[
            'myDay', 'myHour', 
            [sequelize.fn('concat', sequelize.col('prior'), ',', sequelize.col('storeType')), 'result']
        ]
    });
    const parsedView = JSON.parse(JSON.stringify(getView));
    const json2csvParser = new Json2csvParser({header: true});
    const csvFile = json2csvParser.parse(parsedView);

    fs.writeFile('useableVisits.csv', csvFile, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("useableVisits.csv CREATED")
        }
    });

    let options = {
        mode: 'text',
        pythonOptions: ['-u'],
        scriptPath: './'
    }

    PythonShell.run('/predictVisits.py', options, function(err, result){
        if(err){
            throw err;
        }
        else{
            console.log(result);
        }
    });
}