const express = require("express");
const availability = require("./data/available_teachers");
const teachers = require("./data/teacher_data");
const lessons = require("./data/teacher_lessons");
let currentResponse = 0;
const fs = require("fs");

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

apiRouter.get("/teachers/:id/photo", (req, res) => {
  const teacherID = req.params.id;
  const photoData = fs.readFileSync(`./data/images/${teacherID}.jpeg`);
  res.writeHead(200, {'Content-Type': 'image/jpeg'});
  res.write(photoData);
});




module.exports = apiRouter;

