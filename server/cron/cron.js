const Ably = require("ably");
require("dotenv").config({ path: "../.env" });
const mysql = require("mysql2");
const cron = require("node-cron");
const moment = require("moment");
const mongoose = require("mongoose");
const { ChartSchema } = require("../models/models.js");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

const width = 400; //px
const height = 400; //px
const backgroundColour = "white"; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour,
});

const con = mysql.createPool({
  multipleStatements: true,
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "bitcoin",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

mongoose
  .connect(process.env.ATLAS_URI, {
    ssl: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("Mongo DB connected!");
  })
  .catch((err) => {
    console.log(Error, err.message);
  });

// BTC price and timestamp
let prices = [];

// set up Ably
let ably = new Ably.Realtime(process.env.ABLY);
let chanName = "[product:ably-coindesk/bitcoin]bitcoin:usd";
let channel = ably.channels.get(chanName);

channel.subscribe(function (message) {
  prices.push([
    parseFloat(message.data),
    message.timestamp,
    moment(message.timestamp).format("YYYY-MM-DD HH:mm:ss"),
    moment(message.timestamp).format("YYYY"),
    moment(message.timestamp).format("MM"),
    moment(message.timestamp).format("DD"),
    moment(message.timestamp).format("HH"),
    moment(message.timestamp).format("HH00"),
  ]);
});

cron.schedule("*/5 * * * * *", async () => {
  let newPrices = prices;
  prices = [];

  // con.query(`SHOW TABLES LIKE data;`, function (err, rows, fields) {
  //   if (err) throw err;

  //   rows.length === 0
  //     ? con.query(
  //         `CREATE TABLE data (id INT AUTO_INCREMENT PRIMARY KEY, price FLOAT, timestamp BIGINT, date DATETIME, year INT, month INT, day INT, hour INT, zeroHour INT(4) ZEROFILL UNSIGNED);`,
  //         [1, 2],

  //         function (err, rows, fields) {
  //           console.log(`Table data created`);
  //           if (err) throw err;
  //         }
  //       )
  //     :
  // });

  con.query(
    `INSERT INTO data (price, timestamp, date, year, month, day, hour, zeroHour) VALUES ?`,
    [newPrices],
    function (err, rows, fields) {
      console.log(
        "Data saved to MySQL at",
        moment().format("YYYY-MM-DD HH:mm:ss")
      );
      if (err) throw err;
    }
  );

  let model;

  (async () => {
    const configuration = {
      // See https://www.chartjs.org/docs/latest/configuration
      type: "line",
      data: newPrices,
      options: {},
      plugins: [],
      width: 800,
      height: 600,
    };

    let chartUrl = await chartJSNodeCanvas.renderToDataURL(configuration);

    let base64string = chartUrl.split(",")[1];

    model = new ChartSchema({
      date: moment().format("YYYY-MM-DD HH00"),
      image: {
        data: Buffer.from(base64string, "base64"),
        contentType: "image/png",
      },
    });

    model.save(function (err, doc) {
      if (err) return console.error(err);
      console.log(
        "Data saved to MongoDB at",
        moment().format("YYYY-MM-DD HH:mm:ss")
      );
    });
  })();
});
