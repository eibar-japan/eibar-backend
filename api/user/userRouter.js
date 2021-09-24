const express = require("express");
const { createUser, updateUser, deleteUser } = require("./userUtil");

const getUserRouter = (knex) => {
  const userRouter = express.Router();

  userRouter.post("/", createUser(knex));

  userRouter.patch("/:userId", updateUser(knex));

  userRouter.delete("/:userId", deleteUser(knex));

  return userRouter;
};

module.exports = getUserRouter;
