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
        var curX = req.body.x;
        var curY = req.body.y;
        var id = req.body.id;
        var radius = 100;
        
        let ts = Date.now()
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
        var prior = getPrior['store.storeType'];

        var getPrediction = await model.treeResult.findAll({
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
                }
            }
        });
        console.log(getPrediction);
        
}

exports.makePrediction = async (req, res, next) => {
    const getView = await model.useableVisit.findAll();
    const parsedView = JSON.parse(JSON.stringify(getView));
    //console.log(parsedView)
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