const jwtService = require("../services/jwt.service");
module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization.split(" ");
    if (
      !authorization &&
      authorization[0] != "Bearer" &&
      !authorization[1] &&
      !req.cookies.refreshToken
    ) {
      return res.status(401).send({ msg: "Unauthorized" });
    }
    const decoded = await jwtService.verifyAccessToken(authorization[1]);
    if (Date.now() > decoded.exp * 1000) {
      return res.status(401).send({ msg: "Unauthorized" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ msg: "Unauthorized" });
  }
};
