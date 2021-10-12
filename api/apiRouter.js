const express = require("express");

const availability = require("../data/available_teachers");
const { createErrorResponse } = require("./util/error_handling");

// const teachers = require("../data/teacher_data");
// const lessons = require("../data/teacher_lessons");
let currentResponse = 0;
const checkToken = require("../auth/auth");

const getUserRouter = require("./user/userRouter");

const getApiRouter = (knex) => {
  const apiRouter = express.Router();

  apiRouter.use("/", setupErrorTracker);

  apiRouter.use("/user", getUserRouter(knex));

  apiRouter.get("/availability", checkToken, (req, res) => {
    console.log("inside availability");
    currentResponse = (currentResponse + 1) % 2;
    res.json(availability[currentResponse]);
  });

  apiRouter.use("/", (err, req, res, next) => {
    if (err.eibarErrors?.length >= 1) {
      const { statusCode, responseBody } = createErrorResponse(err.eibarErrors);
      res.status(statusCode).json(responseBody);
    } else {
      // res.status(400).send(err.message);
      res.status(500).send(err.message);
    }
  });

  return apiRouter;
};

function setupErrorTracker(req, res, next) {
  res.eibarErrors = [];
  next();
}

module.exports = getApiRouter;
