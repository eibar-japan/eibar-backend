const express = require("express");
const teachers = require("./data/available_teachers")
let currentResponse = 0;

const apiRouter = express.Router();


apiRouter.get("/teachers", (req, res) => {
  currentResponse = (currentResponse + 1) % 2;
  res.json(teachers[currentResponse]);
});

module.exports = apiRouter;

