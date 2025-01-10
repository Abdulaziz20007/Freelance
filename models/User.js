const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Admin = sequelize.define(
  "admin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
    },
    surname: {
      type: DataTypes.STRING(50),
    },
    phone: {
      type: DataTypes.STRING(15),
    },
    email: {
      type: DataTypes.STRING(50),
    },
    password: {
      type: DataTypes.STRING(255),
    },
    is_active: {
      type: DataTypes.BOOLEAN,
    },
    refresh_token: {
      type: DataTypes.STRING(255),
    },
    verification: {
      type: DataTypes.STRING(255),
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Admin;
