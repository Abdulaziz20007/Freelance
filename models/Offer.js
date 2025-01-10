const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Offer = sequelize.define(
  "offer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    freelancer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    project_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    duration: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Offer;
