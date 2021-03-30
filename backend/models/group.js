const User = require("./user")

module.exports = (sequelize,DataTpyes)=>{
    return sequelize.define('group',{
        groupId:{
            type:DataTpyes.UUID,
            allowNull:false,
            unique:true,
            primaryKey:true
        },
        groupName:{
            type:DataTpyes.STRING,
            allowNull:true
        },
        userId:{
            type:DataTpyes.UUID,
            references:{
                model:'users',
                key:'userId'
            }
        }
    },{
        timestamps:true
    })
}