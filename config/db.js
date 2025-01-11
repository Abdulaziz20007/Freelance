const { Sequelize } = require("sequelize");
const config = require("config");

const sequelize = new Sequelize(
  config.get("dbName"),
  config.get("dbUsername"),
  config.get("dbPassword"),
  {
    dialect: "postgres",
    logging: false,
    host: config.get("dbHost"),
    port: config.get("dbPort"),
  }
);

module.exports = sequelize;
