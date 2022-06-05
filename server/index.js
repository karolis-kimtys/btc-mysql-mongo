const express = require("express");
const { mysqlDB, mongoose } = require("./database/databases.js");
const routes = require("./routes/routes.js");
const cors = require("cors");
const app = express();
const { ChartSchema } = require("./models/models.js");

(async () => {
  try {
    await mysqlDB.authenticate();
    console.log("MySQL connected...");
  } catch (error) {
    console.error("Connection error:", error);
  }
})();

(async () => {
  try {
    await mongoose.connection.once("open", () => {
      console.log("MongoDB connection initiated...");
    });
  } catch (error) {
    console.error("Connection error:", error);
  }
})();

app.use(cors());
app.use(express.json());
app.use("/", routes);

app.route("/add").post((req, res) => {
  const date = req.body.date;
  const url = req.body.url;

  const newChart = new ChartSchema({
    date: "date",
    image: {
      data: Buffer.from(url, "base64"),
      contentType: "image/png",
    },
  });

  newChart
    .save()
    .then(() => res.json(`Chart.js URL saved in DB!`))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.listen(5001, () => console.log("Server running at port 5001"));
