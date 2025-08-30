require("dotenv").config(); // load .env variables

const PORT = process.env.PORT || 3005;
const DB_PATH = process.env.DB_PATH;


module.exports = { PORT, DB_PATH };
