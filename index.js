const knex = require("./external/db/knex")(
  process.env.NODE_ENV || "development"
);

const express = require("express");
const app = express();
const apiRouter = require("./api/apiRouter")(knex);
const port = process.env.PORT || 3000;
// const expressip = require("express-ip");
require("dotenv").config();

// app.use(express.static("dist"));
// app.use(expressip().getIpInfoMiddleware);
app.use(
  "/api",
  express.json(),
  express.urlencoded({ extended: true }),
  apiRouter
);

app.listen(port, () => console.log(`Eibar-backend listening on port ${port}!`));

module.exports = { knex, app };
