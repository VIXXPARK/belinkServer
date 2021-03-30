module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('store',{
        storeId:{
            type:DataTypes.UUID,
            primaryKey:true,
            allowNull:false,
            unique:true
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
            type:DataTypes.TINYINT,
            defaultValue:0
        },
        comapnyNum:{
            type:DataTypes.STRING,
        }
    },{
        timestamps:true
    })
}