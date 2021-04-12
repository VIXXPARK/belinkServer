const models = require("../models");

module.exports = function(){
    var phNums = ["01084519514", "01011112222", "01022224444", "01033336666", "01044448888", "01012341234", "01077777777", "01066666666", "01043214321", "01000000000"];
    var usernames = ["min", "minseop", "su", "suhan", "kyung", "kyungjae", "hyun", "hyunjin", "profbyun", "profkwon"];
    var testUsers = []
    for(var i = 0; i < phNums.length; i++){
        var tmp = {
            phNum: phNums[i],
            username: usernames[i]
        };

        testUsers.push(tmp);
    }

    models.User.bulkCreate(testUsers
    , {returnung: true})
    .then((result) => {
        //console.log(result)
    })
}