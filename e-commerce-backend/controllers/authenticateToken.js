const jwt = require("jsonwebtoken");
const ACCESS_SECRET = process.env.ACCESS_TOKEN_KEY;

module.exports = function authenticateToken(req, res, next) {
    const token = req.cookies && req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "You are not logged in" });
    }
    jwt.verify(token, ACCESS_SECRET, (err, user) => {
      if (err) return res.status(403).json({ success: false, message: "Invalid or expired token" });
      req.user = user;
      next();
    });
};