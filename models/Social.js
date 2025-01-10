const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Social = sequelize.define(
  "social",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Social;
