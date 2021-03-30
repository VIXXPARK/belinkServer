const { sequelize, Sequelize, User, Store } = require(".");

module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('infection',{
        userId:{
            type:DataTypes.UUID,
            references:{
                model:'users',
                key:'userId'
            }
        },
        storeId:{
            type:DataTypes.UUID,
            references:{
                model:'stores',
                key:'storeId'
            }
        }
    },{
        timestamps:true
    })
};