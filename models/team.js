const { Sequelize } = require(".");
const User = require("./user");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "team",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      teamName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );
};
