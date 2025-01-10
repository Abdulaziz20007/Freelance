const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Category = sequelize.define(
  "category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parent_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Category;
