const { resolve, reject } = require("bluebird");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const env = process.env;

const authMiddleware = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.query.token;

  if (!token) {
    return res.status(403).json({
      success: true,
      message: "로그인 실패",
    });
  }

  const p = new Promise((resolve, reject) => {
    jwt.verify(token, env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });

  const onError = (error) => {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  };

  p.then((decoded) => {
    req.decoded = decoded;
    next();
  }).catch(onError);
};

module.exports = authMiddleware;
