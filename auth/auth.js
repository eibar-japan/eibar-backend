const checkToken = (req, res, next) => {
  let [type, token] = req.headers.authorization.split(" ");

  if (type === "Bearer" && token === "12345") {
    req.eibarUserName = "ian@cameron.com";
    next();
    return;
  }
  // res.status(403).send("Invalid Token");
  let tokenError = new Error("this is a problem");
  tokenError.statusCode = 403;
  throw tokenError;
};

module.exports = checkToken;
