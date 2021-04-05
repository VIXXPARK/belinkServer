module.exports = (sequelize,DataTypes)=>{
    return sequelize.define("member",{
        teamId:{
            type:DataTypes.UUID,
            references:{
                model:'teams',
                key:'id'
            }
        },
        userId:{
            type:DataTypes.UUID,
            references:{
                model:'users',
                key:'id'
            }
        }
    })
}