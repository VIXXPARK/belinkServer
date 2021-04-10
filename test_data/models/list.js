module.exports = function(sequelize, DataTypes){
    var list = sequelize.define('list', {
      userId:{
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      storeId:{
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      location: {
          type: DataTypes.STRING,
      }
    },{
      timestamps:false
    });
  
    return list;
  };
  