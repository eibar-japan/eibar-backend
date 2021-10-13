const express = require("express");
const { createUser, updateUser, deleteUser } = require("./userUtil");
const {
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("./teacherUtil");

const getUserRouter = (knex) => {
  const userRouter = express.Router();

  // user endpoints
  userRouter.post("/", createUser(knex));

  userRouter.patch("/:userId", updateUser(knex));

  userRouter.delete("/:userId", deleteUser(knex));

  // teacher profile endpoints
  userRouter.post("/:userId/teacher", createTeacher(knex));

  userRouter.patch("/:userId/teacher/:teacherId", updateTeacher(knex));

  userRouter.delete("/:userId/teacher/:teacherId", deleteTeacher(knex));

  return userRouter;
};

module.exports = getUserRouter;
