const { sequelize, Sequelize, User, Store } = require(".");

module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('visit',{
        storeId:{
            type:DataTypes.UUID,
            references:{
                model:'stores',
                key:'storeId'
            }
        },
        userId:{
            type:DataTypes.UUID,
            references:{
                model:'users',
                key:'userId'
            }
        }
    },{
        timestamps:true
    })
}