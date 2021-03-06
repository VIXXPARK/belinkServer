const { Sequelize, Store, Team } = require(".");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "accept",
    {
      cnt: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      total: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: true,
    }
  );
};
