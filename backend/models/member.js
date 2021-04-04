module.exports = (sequelize,DataTypes)=>{
    return sequelize.define("member",{
        groupId:{
            type:DataTypes.UUID,
            references:{
                model:'groups',
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