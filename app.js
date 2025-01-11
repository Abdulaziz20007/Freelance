const express = require("express");
const config = require("config");
const sequelize = require("./config/db");
const mainRouter = require("./routes/index.routes");
const cookieParser = require("cookie-parser");

const PORT = config.get("port");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", mainRouter);

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();
