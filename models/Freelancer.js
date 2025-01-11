const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Freelancer = sequelize.define(
  "freelancer",
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
    bio: {
      type: DataTypes.STRING(255),
    },
    portfolio_url: {
      type: DataTypes.STRING(255),
    },
    availability: {
      type: DataTypes.BOOLEAN,
    },
    rating: {
      type: DataTypes.DECIMAL,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    refresh_token: {
      type: DataTypes.STRING(255),
    },
    verification: {
      type: DataTypes.STRING(255),
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Freelancer;
