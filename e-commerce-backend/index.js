const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { PORT, DB_PATH } = require("./config");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const cors = require("cors");
const { multer, multerOptions } = require('./multer');
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

// Dynamic CORS middleware to allow any of the allowed origins, matching the request's Origin header
const allowedOrigins = [
    "http://localhost:3001",
    "http://localhost:3000",
    "https://e-commerce-website-admin-phi.vercel.app",
    "https://e-commerce-website-07-sepia.vercel.app"
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // Handle preflight requests
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  if (
    (req.method === 'POST' || req.method === 'PUT') &&
    req.headers['content-type'] &&
    req.headers['content-type'].includes('multipart/form-data')
  ) {
    const multerInstance = multer(multerOptions);
    if (
      req.url.startsWith('/admin/add-product') ||
      req.url.startsWith('/admin/edit-product')
    ) {
      multerInstance.array('images', 10)(req, res, next); 
    } else {
      multerInstance.single('photo')(req, res, next);
    }
  } else {
    next();
  }
});


// Routers
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

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
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
