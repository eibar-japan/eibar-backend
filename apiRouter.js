const express = require("express");
const availability = require("./data/available_teachers");
const teachers = require("./data/teacher_data");
const lessons = require("./data/teacher_lessons");
let currentResponse = 0;

const apiRouter = express.Router();


apiRouter.get("/availability", (req, res) => {
  currentResponse = (currentResponse + 1) % 2;
  res.json(availability[currentResponse]);
});

apiRouter.get("/teachers/:id", (req, res) => {
  const teacherID = req.params.id;
  res.json(teachers[teacherID]);
});

apiRouter.get("/teachers/:id/lessons", (req, res) => {
  const teacherID = req.params.id;
  res.json(lessons[teacherID]);
});


module.exports = apiRouter;

