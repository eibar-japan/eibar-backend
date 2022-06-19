const NODE_ENV = process.env.NODE_ENV || "development";

const knex = require("./external/db/knex")(NODE_ENV);

const express = require("express");
const app = express();
const apiRouter = require("./api/apiRouter")(knex);
const port = process.env.PORT || 3000;

// development-only env var setup. testing doesn't run index, so dotenv is called via -r on the mocha command
if (NODE_ENV === "development") {
  require("dotenv").config();
}

app.use(
  "/api",
  express.json(),
  express.urlencoded({ extended: true }),
  apiRouter
);

switch (NODE_ENV || "development") {
  case "development":
    app.listen(port, () => console.log(`Eibar-backend listening on port ${port}!`));
    break;
  case "staging":
  case "production":
    knex.migrate.latest().then(() => {
      app.listen(port, () => console.log(`Eibar-backend listening on port ${port}!`));
    });
}

module.exports = { knex, app };
