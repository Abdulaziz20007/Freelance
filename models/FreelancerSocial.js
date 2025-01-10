const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const FreelancerSocial = sequelize.define(
  "freelancer_social",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    social_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    freelancer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = FreelancerSocial;
