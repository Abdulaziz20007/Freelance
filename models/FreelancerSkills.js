const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const FreelancerSkills = sequelize.define(
  "freelancer_skill",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    skill_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    freelancer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = FreelancerSkills;
