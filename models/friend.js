const { sequelize, Sequelize, User } = require(".");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("friend", {
    hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};
