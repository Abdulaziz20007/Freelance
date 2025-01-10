const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Ban = sequelize.define(
  "ban",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    admin_id: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    until: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Ban;
