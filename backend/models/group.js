const { Sequelize } = require(".");
const User = require("./user")

module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('group',{
        groupId:{
            type:DataTypes.UUID,
            allowNull:false,
            unique:true,
            primaryKey:true,
            defaultValue:DataTypes.UUIDV4

        },
        groupName:{
            type:DataTypes.STRING,
            allowNull:true
        }
    },{
        timestamps:true
    })
}