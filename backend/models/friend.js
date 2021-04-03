const { sequelize, Sequelize, User } = require(".");

module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('friend',{
        friendId:{
            type:DataTypes.UUID,
            references:{
                model:'users',
                key:'id'
            }
        },
        hidden:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }
    })
};