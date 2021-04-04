const { sequelize, Sequelize, User, Store } = require(".");

module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('visit',{
        infect:{
            type:DataTypes.BOOLEAN,
            defautlValue:false
        }
    },{
        timestamps:true
    })
}