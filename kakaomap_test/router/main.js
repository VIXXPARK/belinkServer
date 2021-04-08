const https = require('https');
const requestApi = require('request');
const express = require("express");
const fetch = require('node-fetch');
const models = require("../models");
const sleep = require('util').promisify(setTimeout)
const format = require('string-format')

module.exports = function(app){
    app.get("", function(req, res){
        res.render('showMap', {
          title: 'Map',
          length: 5,
          pageTitle: 'KakaoMap Test',
          places: []
        });
    });

    app.get("/store/signup-page", function(req, res){
        res.render('storeSignUp', {
            pageTitle: "Store Sign Up Page"
        });
    });
    app.post("/store/signup", function(req, res){
        console.log(req.body);
        var name = req.body["name"];
        var location = req.body["location"];
        var type = req.body["type"];

        var keywordQuery = location + " " + name;

        
        var plCode;
        if(type == "restaurant"){
            plCode = 'FD6';
        }
        if(type == "cafe"){
            plCode = 'CE7';
        }
        if(type == "hotel"){
            plCode = 'AD5';
        }
        if(type == "hospital"){
            plCode = 'HP8';
        }
        if(type == "pharmacy"){
            plCode = 'PM9';
        }

        var tmpUri = encodeURI("https://dapi.kakao.com/v2/local/search/keyword.json?page=1&size=15&sort=accuracy&category_group_code="+plCode+"&query="+keywordQuery);
        //keywordQuery가 한글이기 때문에 encodeURI를 해줘야됨
        
        let kakaoOptions = {
            uri: tmpUri,
            method: "GET",
            headers:{
                'Authorization': 'KakaoAK c9f67cf11819f1c1e3c318b99d7dfac1'
            },
            encoding:'utf-8'
        } 
        
        requestApi(kakaoOptions, function(error, res, body){
            var parsedBody = JSON.parse(body);
            var places = parsedBody["documents"];
            
            if(places.length == 0){
                console.log("NO MATCHING RESULTS");
            }
            else{
                var mostAcc = places[0];
                models.Store.create({
                    id: mostAcc["id"],
                    storeName: mostAcc["place_name"],
                    storeLocation: mostAcc["road_address_name"],
                    storeType: mostAcc["category_group_code"]
                });
            }
        });
    });

    app.post("/show-places", function(req, res){
        var strPlaces = req.body["places"];
        if(strPlaces == 'restaurant'){
            var plCode = ['FD6'];
        }
        else if(strPlaces == 'cafe'){
            var plCode = ['CE7'];
        }
        else if(strPlaces == 'leisure'){
            var plCode = ['MT1','CS2','CT1', 'AT4', 'AD5'];
        }
        console.log("Places Code: " + plCode);

        var curX = 127.1025;
        var curY = 37.5126;
        var radius = 100; //미터
        var tmpUri = "https://dapi.kakao.com/v2/local/search/category.json?category_group_code="+plCode+"&page=1&size=15&sort=distance&radius="+radius+"&x="+curX+"&y="+curY;
        
        let kakaoOptions = {
            uri: tmpUri,
            method: "GET",
            headers:{
                'Authorization': 'KakaoAK c9f67cf11819f1c1e3c318b99d7dfac1'
            },
            encoding:'utf-8'
        }        

        var tmpUserId = "min";
        var placeNames = [];
        var placeLocation = [];
        var placeId = [];

        /*
        models.list.destroy({
            where:{
                userId: tmpUserId
            }
        });
        */

        requestApi(kakaoOptions, function(error, resB, body){
            var parsedBody = JSON.parse(body);
            var places = parsedBody["documents"];
                
            for(var j = 0; j < places.length; j++){
                placeNames.push(places[j]["place_name"]);
                placeLocation.push(places[j]["road_address_name"]);
                placeId.push(places[j]["id"]);
                /*models.list.create({
                    userId: tmpUserId,
                    storeId: places[j]["place_name"],
                    location: places[j]["road_address_name"]
                })*/
            }
            var totalPage = Math.ceil(parsedBody["meta"]["pageable_count"]/15);
            for(var i = 1; i < totalPage; i++){
                var curPage = i + 1;
                var tmpUriB = "https://dapi.kakao.com/v2/local/search/category.json?category_group_code="+plCode+"&page="+curPage+"&size=15&sort=distance&radius="+radius+"&x="+curX+"&y="+curY;

                let kakaoOptionsB = {
                    uri: tmpUriB,
                    method: "GET",
                    headers:{
                        'Authorization': 'KakaoAK c9f67cf11819f1c1e3c318b99d7dfac1'
                    },
                    encoding:'utf-8'
                }
                requestApi(kakaoOptionsB, function(error, resB, bodyB){
                    var parsedBodyB = JSON.parse(bodyB);
                    var placesB = parsedBodyB["documents"];
                    for(var j = 0; j < placesB.length; j++){
                        placeNames.push(placesB[j]["place_name"]);
                        placeLocation.push(placesB[j]["road_address_name"]);
                        placeId.push(placesB[j]["id"]);
                        /*models.list.create({
                            userId: tmpUserId,
                            storeId: placesB[j]["place_name"],
                            location: placesB[j]["road_address_name"]
                        })*/
                    }
                    if(parsedBodyB["meta"]["is_end"] == true){
                        console.log(placeNames);
                        console.log("총 개수:" + placeNames.length);
                        res.render('showMap', {
                            title: 'Map',
                            length: 5,
                            pageTitle: 'KakaoMap Test',
                            places: placeNames,
                            storeId: placeId
                        });
                    }
                });                
            }
        });
        
    });

    app.get('/prediction/send-confirmation/:store_id', async function(req, res){
       var tmpUserId = "min";
       console.log(req.params.store_id);
       await models.Visit.create({
           userId: tmpUserId,
           storeId: req.params.store_id
       });
    });
}