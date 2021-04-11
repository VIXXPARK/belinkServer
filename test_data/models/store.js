const { Sequelize } = require(".");

module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('store',{
        id:{
            type:DataTypes.UUID,
            primaryKey:true,
            allowNull:false,
            unique:true,
            defaultValue:DataTypes.UUIDV4
        },
        storeName:{
            type:DataTypes.STRING,
            allowNull:false
        },
        storeLocation:{
            type:DataTypes.STRING,
            allowNull:false
        },
        storeType:{
            type:DataTypes.STRING(3),
            defaultValue:0
        },
        comapnyNum:{
            type:DataTypes.STRING,
        }
    },{
        timestamps:true
    })
}