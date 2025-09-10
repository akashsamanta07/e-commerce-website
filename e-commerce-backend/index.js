const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { PORT, DB_PATH } = require("./config");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const cors = require("cors");
const rootDir = require("./utils/pathUtil");
const cookieParser = require("cookie-parser");
const { multer, multerOptions } = require("./multer");

const app = express();

app.use(cookieParser());


const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://e-commerce-website-07-sepia.vercel.app",
  "https://e-commerce-website-admin-phi.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Log error for debugging, but allow for now
      console.error(`CORS error: Origin ${origin} is not allowed`);
      callback(null, true);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Multer middleware for file uploads
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

app.use(express.static(path.join(rootDir, 'public')));

// Routers
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Server is running securely" });
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
