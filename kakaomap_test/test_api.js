const request = require('request');
const bodyParser = require('body-parser');

let kakaoOptions = {
        uri: "https://dapi.kakao.com/v2/local/search/category.json?category_group_code=PM9&page=1&size=15&sort=distance&radius=100&x=37.5126&y=127.1025",
        method: "GET",
        headers:{
                'Authorization': 'KakaoAK c9f67cf11819f1c1e3c318b99d7dfac1'
        },
        encoding:'utf-8'
}

function callback(error,res, body){
        console.log(body);
}
request(kakaoOptions,callback)