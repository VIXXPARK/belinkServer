const { Sequelize } = require(".");



module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('user',{
        id:{
            type:DataTypes.UUID,
            allowNull:false,
            primaryKey: true,
            defaultValue:DataTypes.UUIDV4
        },
        phNum:{
            type:DataTypes.STRING,
        },
        username:{
            type:DataTypes.STRING,
            allowNull:false
        },
        active:{
            type:DataTypes.BOOLEAN,
            defaultValue: true
        },
        admin:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }

    },{
        timestamps:false,
    });
};
