const models = require("../models");

module.exports = async function(){
    var allUsersId = await models.User.findAll({
        attributes: ["id"],
        raw: true
    });

    for(var i = 0; i < allUsersId.length; i++){
        for(var j = i+1; j < allUsersId.length; j++){
            models.Friend.create({
                device: allUsersId[i]["id"],
                myFriend: allUsersId[j]["id"]
            });
        }
    }
}