const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Skill = sequelize.define(
  "skill",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    skill: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Skill;
