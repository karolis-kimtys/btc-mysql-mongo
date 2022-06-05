const Sequelize = require("sequelize");
const mongoose = require("mongoose");
require("dotenv").config();

const mysqlDB = new Sequelize("bitcoin", "root", "password", {
  host: "localhost",
  dialect: "mysql",
});

mongoose
  .connect(process.env.ATLAS_URI, {
    ssl: true,
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("Mongo DB connected!");
  })
  .catch((err) => {
    console.log(Error, err.message);
  });

module.exports = { mysqlDB, mongoose };
