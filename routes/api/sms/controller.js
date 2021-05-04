const requestApi = require('request');
const express = require("express");
const cryptoJS = require('crypto-js');
const sha256 = require('crypto-js/sha256');
const base64 = require('crypto-js/enc-base64');
const redis = require('redis');
const redisClient = redis.createClient();
const keys = require('../../config/naver_config');
const keys = {
    "senderNum": process.env.senderNum,
    "accessKey": process.env.accessKey,
    "secretKey": process.env.secretKey,
    "serviceId": process.env.serviceId
}

exports.sendMsg = (req, res, next) => {
        const senderNum = keys.senderNum;
        const accessKey = keys.accessKey;
        const secretKey = keys.secretKey;
        const serviceId = keys.serviceId;
        const url = 'https://sens.apigw.ntruss.com/sms/v2/services/'+serviceId+'/messages';
        const date = Date.now().toString();
        
        function makeSignature(){
            var space = ' ';
            var newLine = '\n';
            var method = 'POST';
            var url2 = '/sms/v2/services/'+serviceId+'/messages';
            var date2 = date;
            var accessKey2 = accessKey;
            var secretKey2 = secretKey;

            var hmac = cryptoJS.algo.HMAC.create(cryptoJS.algo.SHA256, secretKey2);
            hmac.update(method);
            hmac.update(space);
            hmac.update(url2);
            hmac.update(newLine);z
            hmac.update(date);
            hmac.update(newLine);
            hmac.update(accessKey2);

            var hash = hmac.finalize();

            return hash.toString(cryptoJS.enc.Base64);
        }
        const signature = makeSignature();

        var certNum = 0;
        for(var i  = 0; i < 6; i++){
            certNum = certNum*10 +(Math.floor(Math.random()*10));
        }
        //redisClient.flushall();
        redisClient.hmset('verification-info', req.body.to, JSON.stringify({'certNum':certNum, 'time':date}));

        var msg = "인증번호 ["+certNum+"] 를 입력해 주세요.";
        const msgHeader = {
            'Content-type': 'application/json; charset=utf-8',
            'x-ncp-iam-access-key': accessKey,
            'x-ncp-apigw-timestamp': date,
            'x-ncp-apigw-signature-v2': signature
        }
        const msgBody = {
            'type':'SMS',
            'contentType':'COMM',
            'countryCode':'82',
            'from': senderNum,
            'content':msg,
            'messages':[
                {to: req.body.to}
            ]
        }

        const msgOptions = {
            method:'POST',
            json:true,
            uri: url,
            headers: msgHeader,
            body: msgBody
        }
        
        requestApi(msgOptions, function(err, res2, success){
            if(err){
                console.log(err);
            }
            else{
                console.log(success);
            }
        });
}

exports.sendCode = (req, res, next) => {
    var phNum = req.body.phNum;
    var certNum = req.body.certNum;
    redisClient.hgetall('verification-info', function(err, obj){
        if(err || obj == null){
            console.log(err);
        }
        else{
            if(obj[phNum]){
                var paresedObj = JSON.parse(obj[phNum]);
                if(Date.now()-paresedObj.time <= 180000){    //180000ms == 3 minutes
                    if(paresedObj.certNum==certNum){
                        console.log("Verifyed");
                        redisClient.hdel('verification-info', phNum);
                    }
                    else{
                        console.log("Incorrect Verification Number");
                    }
                }
                else{
                    console.log("Timed Out");
                    redisClient.hdel('verification-info', phNum);
                }
            }
            else{
                console.log("Invalid Phone Number");
            }
        }
    });
}