module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('user',{
        userId:{
            type:DataTypes.UUID,
            allowNull:false,
            unique:true,
            primaryKey: true
        },
        phNum:{
            type:DataTypes.STRING(11),
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
