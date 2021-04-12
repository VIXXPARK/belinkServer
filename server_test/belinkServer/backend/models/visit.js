const { sequelize, Sequelize, User, Store } = require(".");

module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('visit',{
    },{
        timestamps:true
    })
}