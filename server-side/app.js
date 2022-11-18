const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const connectToDatabase = require("./config/database");
const errorHandler = require("./middleware/error");

// Load env
dotenv.config({ path: "./config/config.env" });
// Connect to database
connectToDatabase();

//Importing routes
const auth = require("./routes/auth");
const users = require("./routes/users");

const app = express();

// Setting Body parser
app.use(express.json());

// Show logs in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Enable CORS
app.use(cors());

// Setting base api to relevant routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
