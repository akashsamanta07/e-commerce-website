const express = require('express');
const mongoose = require('mongoose');
const { PORT, DB_PATH } = require("./config");
const userRouter = require("./routes/userRouter");
const hostRouter = require("./routes/hostRouter");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(cors({
    origin: [
        "http://localhost:3000",
        "*"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// NOTE: Remove problematic app.options("*", cors()) which can cause path-to-regexp error
// app.options("*", cors());

// Parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// HTTP request logger
app.use(morgan("dev"));

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false // disables the policy for compatibility
  })
);

// Routers
app.use("/host", hostRouter);
app.use("/user", userRouter);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Server is running securely 🚀" });
});

// Connect to MongoDB and start server
mongoose.connect(DB_PATH)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on address http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    // Print error and exit if MongoDB connection fails
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

