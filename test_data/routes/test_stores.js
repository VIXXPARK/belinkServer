const https = require('https');
const requestApi = require('request');
const models = require("../models");
const format = require('string-format')
const promisify = require('util').promisify;
const async = require('async');

const location = ["건대입구역", "잠실역", "강남역", "왕십리역", "홍대입구역", "여의도역"];
const plCode = ["FD6", "CE7", "PC", "THM"];

var getStores = async function(){
    for(const curLocation of location){
        for(const curCode of plCode){
            if(curCode == "PC"){
                await requestApi({
                    uri: encodeURI("https://dapi.kakao.com/v2/local/search/keyword.json?page=1&size=15&sort=accuracy&query="+(curLocation+" PC방")),
                    method: "GET",
                    headers:{
                        'Authorization': 'KakaoAK c9f67cf11819f1c1e3c318b99d7dfac1'
                    },
                    encoding:'utf-8'
                    } , async function(error, res, body){
                    var parsedBody = JSON.parse(body);
                    var places = parsedBody["documents"];
                            
                    for(const curPlace of places){
                        await models.Store.create({
                            id: curPlace["id"],
                            storeName: curPlace["place_name"],
                            storeLocation: curPlace["road_address_name"],
                            storeType: "PC"
                        });
                    }
                    
                })
            }
            else if(curCode == "THM"){
                await requestApi({
                    uri: encodeURI("https://dapi.kakao.com/v2/local/search/keyword.json?page=1&size=15&sort=accuracy&query="+(curLocation+" 테마카페")),
                    method: "GET",
                    headers:{
                        'Authorization': 'KakaoAK c9f67cf11819f1c1e3c318b99d7dfac1'
                    },
                    encoding:'utf-8'
                    } , async function(error, res, body){
                    var parsedBody = JSON.parse(body);
                    var places = parsedBody["documents"];
                            
                    for(const curPlace of places){
                        await models.Store.create({
                            id: curPlace["id"],
                            storeName: curPlace["place_name"],
                            storeLocation: curPlace["road_address_name"],
                            storeType: "THM"
                        });
                    }
                    
                })
            }
            else{
                await requestApi({
                    uri: encodeURI("https://dapi.kakao.com/v2/local/search/keyword.json?page=1&size=15&sort=accuracy&category_group_code="+curCode+"&query="+curLocation),
                    method: "GET",
                    headers:{
                        'Authorization': 'KakaoAK c9f67cf11819f1c1e3c318b99d7dfac1'
                    },
                    encoding:'utf-8'
                    } , async function(error, res, body){
                    var parsedBody = JSON.parse(body);
                    var places = parsedBody["documents"];
                    
                    for(const curPlace of places){
                        await models.Store.create({
                            id: curPlace["id"],
                            storeName: curPlace["place_name"],
                            storeLocation: curPlace["road_address_name"],
                            storeType: curPlace["category_group_code"]
                        });
                    }
                })
            }
        }
    }
}

module.exports = promisify(getStores);