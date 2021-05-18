const { Sequelize } = require(".");

module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('treeResult',{
        sTime:{
            type:DataTypes.INTEGER,
            primaryKey:true
        },
        dTime:{
            type:DataTypes.INTEGER,
            primaryKey:true
        },
        sDay:{
            type:DataTypes.INTEGER,
            primaryKey:true
        },
        dDay:{
            type:DataTypes.INTEGER,
            primaryKey:true
        },
        prior:{
            type:DataTypes.STRING,
            primaryKey:true
        },
        storeType:{
            type:DataTypes.STRING
        }
    },{
        timestamps:false,
    });
};
