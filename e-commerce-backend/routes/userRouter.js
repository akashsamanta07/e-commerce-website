const express = require("express");
const userRouter = express.Router();

// Example user route (you can add more as needed)
userRouter.get("/", (req, res) => {
  res.json({ message: "User route working!" });
});

module.exports = userRouter;
