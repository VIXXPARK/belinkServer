const { sequelize, Sequelize, User, Store } = require(".");

module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('entryNotice',{
        userId:{
            type:DataTypes.UUID,
            allowNull:false,
            primaryKey: true,
            defaultValue:DataTypes.UUIDV4
        },
        storeId:{
            type:DataTypes.UUID,
            allowNull:false,
            primaryKey: true,
            defaultValue:DataTypes.UUIDV4
        },
    },{
        timestamps:true
    })
}