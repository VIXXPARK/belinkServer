const { Sequelize } = require(".");

module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('treeResult',{
        sTime:{
            type:DataTypes.INTEGER,
        },
        dTime:{
            type:DataTypes.INTEGER,
        },
        sDay:{
            type:DataTypes.INTEGER,
        },
        dDay:{
            type:DataTypes.INTEGER,
        },
        sPrior:{
            type:DataTypes.INTEGER,
        },
        dPrior:{
            type:DataTypes.INTEGER,
        },
        storeType:{
            type:DataTypes.STRING(3)
        }
    },{
        timestamps:false,
    });
};
