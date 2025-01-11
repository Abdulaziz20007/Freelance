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
      unique: true,
      message: "Telefon raqam avval ro'yxatdan o'tgan",
    },
    email: {
      type: DataTypes.STRING(50),
      unique: true,
      message: "Email avval ro'yxatdan o'tgan",
    },
    password: {
      type: DataTypes.STRING(255),
    },
    refresh_token: {
      type: DataTypes.STRING(255),
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Admin;
