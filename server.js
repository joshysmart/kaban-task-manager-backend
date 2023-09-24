const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const colors = require('colors');
const morgan = require("morgan");
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require("./config/db")
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

dotenv.config({ path: "./config/config.env" });

connectDB();

const boards = require("./routes/boards");
const userBoards = require("./routes/userBoards");
const auth = require("./routes/auth");


const app = express()
// const app = express();

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);


// Dev loging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/boards", boards);
app.use("/api/v1/boards/user", userBoards);
app.use('/api/v1/auth', auth);


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to kanban application." });
});

app.use(errorHandler);

// set port, listen for requests
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});