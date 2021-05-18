const requestApi = require('request');
const express = require("express");
const model = require('../../../models')

exports.signup = (req, res, next) => {
    //매장의 주소(address) & 매장 이름(name) & 사업자 번호(companyNum) 입력 받음
    if(!('address' in req.body) || !('name' in req.body) || !('companyNum' in req.body)){
        console.log("Insert all necessary information");
    }
    else{
        const address = req.body.address;
        const name = req.body.name;
        const companyNum = req.body.companyNum;

        var keyword = address + " " + name;
        var url = encodeURI("https://dapi.kakao.com/v2/local/search/keyword.json?page=1&size=15&sort=accuracy&query=" + keyword);   
        let kakaoOptions = {
            uri: url,
            method: "GET",
            headers:{
                'Authorization': 'KakaoAK c9f67cf11819f1c1e3c318b99d7dfac1'
            },
            encoding: "utf-8"
        }

        requestApi(kakaoOptions,  function(err, fin, body){
            var parsedBody = JSON.parse(body);
            var place = parsedBody['documents'][0];
            console.log(place)
            // 테마카페(THM), 노래방(KAR), PC방(PC), 플스방(PC), 영화관(TH1), 연극장(TH2) category_name으로 구별
            //음식점, 일반카페는 category_code로 구별
            if(parsedBody['meta']['total_count'] == 0){
                console.log("Enter the correct information");
            }
            else{
                var storeType = "";
                if(place.category_group_code == "CE7" || place.category_group_code == "FD6"){
                    if(place.category_group_code == "FD6"){
                        storeType = place.category_group_code;
                    }
                    else{
                        if(place.category_name.includes('테마카페')){
                            storeType = "THM";
                        }
                        else{
                            storeType = place.category_group_code;
                        }
                    }
                }
                else if(place.category_group_code == ""){
                    if(place.category_name.includes('노래방')){
                        storeType = "KAR";
                    }
                    else if(place.category_name.includes('게임방')){
                        storeType = "PC";
                    }
                    else if(place.category_name.includes('영화관')){
                        storeType = "TH1";
                    }
                    else if(place.category_name.includes('공연장')){
                        storeType = "TH2";
                    }
                }
               
                model.Store.create({
                    id: place.id,
                    storeName: place.place_name,
                    storeLocation: place.road_address_name,
                    storeType: storeType,
                    companyNum: companyNum,
                    token:req.body.token
                })
                .then(result=>{
                    console.log(place)
                    res.json({
                        data:result
                    })
                })
            }
             
        });
    }
}