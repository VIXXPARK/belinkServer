const requestApi = require('request');
const express = require("express");
const cryptoJS = require('crypto-js');
const sha256 = require('crypto-js/sha256');
const base64 = require('crypto-js/enc-base64');
const keys = require('../../config/naver_config');
const nodeCahce = require("node-cache");
const myCache = new nodeCahce();

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
            hmac.update(newLine);
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
        myCache.set(req.body.to, JSON.stringify({'certNum': certNum, 'time': date}));


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

    var phValue = myCache.get(phNum);
    if(phValue){
        var parsedValue = JSON.parse(phValue)
        if(Date.now() - parsedValue.time <= 180000){
            if(parsedValue.certNum == certNum){
                console.log("Verifyed");
                myCache.del(phNum);
            }
            else{
                console.log("Incorrect Verification Number");
            }
        }
        else{
            console.log("Timed Out");
            myCache.del(phNum);
        }
    }
    else{
        console.log("Invalid Phone Number");
    }

}