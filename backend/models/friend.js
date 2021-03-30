const { sequelize, Sequelize, User } = require(".");

module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('friend',{
        userId:{
            type:DataTypes.UUID,
            references:{
                model:'users',
                key:'userId'
            }
        },
        friendId:{
            type:DataTypes.UUID,
            references:{
                model:'users',
                key:'userId'
            }
        },
        hidden:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }
    })
};