const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Contract = sequelize.define(
  "contract",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.VARCHAR,
      allowNull: false,
    },
    parent_category_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Contract;
