const Ably = require("ably");
require("dotenv").config({ path: "../.env" });
const mysql = require("mysql2");
const cron = require("node-cron");
const moment = require("moment");
const mongoose = require("mongoose");
const { Charts } = require("../models/models.js");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

const options = {
  width: 750,
  height: 500,
};

const canvasRenderService = new ChartJSNodeCanvas(options);

// BTC price and timestamp
let prices = [];
let times = [];

const con = mysql.createPool({
  multipleStatements: true,
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB,
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
  times.push(moment(message.timestamp).format("YYYY-MM-DD HH:mm:ss"));
});

cron.schedule("*/5 * * * *", async () => {
  let newPrices = prices;
  let newTimes = times;
  prices = [];

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
      type: "line",
      data: {
        labels: newTimes,
        datasets: [
          {
            label: `Bitcoin price USD - ${moment().format(
              "YYYY-MM-DD HH:mm:ss"
            )}`,
            data: newPrices,
            fill: false,
            lineTension: 0.2,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "round",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 1,
            pointRadius: 1,
            pointHitRadius: 10,
          },
        ],
      },
    };

    const imageBuffer = await canvasRenderService.renderToDataURL(
      configuration
    );
    console.log("🚀 - file: cron.js - line 117 - imageBuffer", imageBuffer);

    model = new Charts({
      date: moment().format("YYYY-MM-DD HH00"),
      image: {
        data: imageBuffer,
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
