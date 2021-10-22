const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  let token;
  try {
    req.token = jwt.verify(req.get("auth-token"), process.env.JWT_SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
};

module.exports = checkToken;
