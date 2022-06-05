const { condition } = require("sequelize");
const { Op } = require("sequelize");
const { Model } = require("../models/models.js");

const getAll = async (req, res) => {
  try {
    const models = await Model.findAll({
      attributes: ["price", "date", "year", "month", "day", "hour", "zeroHour"],
    });
    res.json(models);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const getAllYears = async (req, res) => {
  try {
    const models = await Model.findAll({
      group: ["year"],
      attributes: ["year"],
    });
    res.json(models);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const getAllMonths = async (req, res) => {
  try {
    const models = await Model.findAll({
      group: ["month"],
      where: { year: req.params.year },
      attributes: ["month"],
    });
    res.json(models);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const getAllDays = async (req, res) => {
  try {
    const models = await Model.findAll({
      group: ["day"],
      where: { year: req.params.year, month: req.params.month },
      attributes: ["day"],
    });
    res.json(models);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const getAllHours = async (req, res) => {
  try {
    const models = await Model.findAll({
      group: ["hour"],
      where: {
        year: req.params.year,
        month: req.params.month,
        day: req.params.day,
      },
      attributes: ["hour"],
    });
    res.json(models);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const getYear = async (req, res) => {
  try {
    const models = await Model.findAll({
      where: { year: req.params.year },

      attributes: ["price", "date", "year", "month", "day", "hour", "zeroHour"],
    });
    res.json(models);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const getMonth = async (req, res) => {
  try {
    const models = await Model.findAll({
      where: { year: req.params.year, month: req.params.month },

      attributes: ["price", "date", "year", "month", "day", "hour", "zeroHour"],
    });
    res.json(models);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const getDay = async (req, res) => {
  try {
    const models = await Model.findAll({
      where: {
        year: req.params.year,
        month: req.params.month,
        day: req.params.day,
      },

      attributes: ["price", "date", "year", "month", "day", "hour", "zeroHour"],
    });
    res.json(models);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const getHour = async (req, res) => {
  try {
    const models = await Model.findAll({
      where: {
        year: req.params.year,
        month: req.params.month,
        day: req.params.day,
        hour: req.params.hour,
      },

      attributes: ["price", "date", "year", "month", "day", "hour", "hour"],
    });
    res.json(models);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const getRange = async (req, res) => {
  try {
    const models = await Model.findAll({
      where: {
        year: {
          [Op.between]: [req.params.fromyear, req.params.toyear],
        },
        month: {
          [Op.between]: [req.params.frommonth, req.params.tomonth],
        },
        day: {
          [Op.between]: [req.params.fromday, req.params.today],
        },
        hour: {
          [Op.between]: [req.params.fromhour, req.params.tohour],
        },
      },
      attributes: ["price", "date", "year", "month", "day", "hour", "zeroHour"],
    });
    res.json(models);
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = {
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
};
