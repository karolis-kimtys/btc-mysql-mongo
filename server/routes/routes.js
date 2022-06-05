const express = require("express");
const {
  getAll,
  getAllYears,
  getAllMonths,
  getAllDays,
  getAllHours,
  getYear,
  getMonth,
  getDay,
  getHour,
  getRange,
} = require("../controllers/controllers.js");

const router = express.Router();

router.get("/getall", getAll);

router.get("/getall/years", getAllYears);
router.get("/getall/:year/months", getAllMonths);
router.get("/getall/:year/:month/days", getAllDays);
router.get("/getall/:year/:month/:day/hours", getAllHours);

router.get("/getby/:year", getYear);
router.get("/getby/:year/:month", getMonth);
router.get("/getby/:year/:month/:day", getDay);
router.get("/getby/:year/:month/:day/:hour", getHour);
router.get(
  "/getrange/:fromyear-:frommonth-:fromday-:fromhour/:toyear-:tomonth-:today-:tohour",
  getRange
);

module.exports = router;
