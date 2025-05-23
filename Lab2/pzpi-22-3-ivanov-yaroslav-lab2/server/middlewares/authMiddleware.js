const tokenService = require("../services/TokenService");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res
        .status(401)
        .json({ message: "User is not authorised (headers)" });
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "User is not authorised (token)" });
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return res.status(401).json({ message: "User is not authorised (user)" });
    }

    req.user = userData;
    next();
  } catch (e) {
    return res
      .status(401)
      .json({ message: "User is not authorised (an error occurred)" });
  }
};
