const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { PORT, DB_PATH } = require("./config");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const cors = require("cors");
const multer = require('multer');
const rootDir = require("./utils/pathUtil");
const cookieParser = require("cookie-parser");



const app = express();

app.use(cookieParser());

// Middleware
app.use(cors({
    origin: [
        "http://localhost:3001",
        "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Helper to get extension from mimetype
const getExtension = (mimetype) => {
  switch (mimetype) {
    case 'image/png':
      return '.png';
    case 'image/jpeg':
      return '.jpg';
    case 'image/jpg':
      return '.jpg';
    default:
      return '';
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = "public/";
    if (req.url.startsWith("/admin/add-home-slider") || req.url.startsWith("/admin/edit-home-slider")) {
      dest = "public/homeSlider/";
    }
    if (req.url.startsWith("/admin/add-category") || req.url.startsWith("/admin/edit-category")) {
      dest = "public/category/";
    }
    if (req.url.startsWith("/admin/add-banner") || req.url.startsWith("/admin/edit-banner")) {
      dest = "public/banner/";
    }
    if (req.url.startsWith("/admin/add-logo") || req.url.startsWith("/admin/edit-logo")) {
      dest = "public/logo/";
    }
    // Add destination for product images
    if (req.url.startsWith("/admin/add-product") || req.url.startsWith("/admin/edit-product")) {
      dest = "public/product/";
    }
    if (req.url.startsWith("/auth/update-profile")) {
      dest = "public/profilePic/";
    }
    // Ensure the folder exists, create if not
    const fullDest = path.join(rootDir, dest);
    if (!fs.existsSync(fullDest)) {
      fs.mkdirSync(fullDest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = getExtension(file.mimetype);
    cb(null, randomString(15) + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const multerOptions = {
  storage,
  fileFilter
};

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

app.use(express.static(path.join(rootDir, 'public')));

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
