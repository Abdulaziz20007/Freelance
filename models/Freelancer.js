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
    },
    email: {
      type: DataTypes.STRING(50),
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

module.exports = Freelancer;
