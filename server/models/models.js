const { Sequelize } = require("sequelize");
const { mysqlDB } = require("../database/databases.js");
const { DataTypes } = Sequelize;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Model = mysqlDB.define(
  "data",
  {
    price: {
      type: DataTypes.FLOAT,
    },
    timestamp: {
      type: DataTypes.BIGINT,
    },
    date: {
      type: DataTypes.DATE,
    },
    year: {
      type: DataTypes.INTEGER,
    },
    month: {
      type: DataTypes.INTEGER,
    },
    day: {
      type: DataTypes.INTEGER,
    },
    hour: {
      type: DataTypes.INTEGER,
    },
    zeroHour: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  }
);

const chartSchema = new Schema({
  date: {
    type: String,
  },

  image: {
    data: String,
    contentType: String,
  },
});

const ChartSchema = mongoose.model("Chart Schema", chartSchema);

module.exports = { Model, ChartSchema };
