// @import - Third-packages
const hbs = require("express-handlebars");
const express = require("express");
const app = express();
// @import - Built-in packages
const path = require("path");
require("dotenv").config();
// @import - Middlewares
const notFound = require("./middlewares/not-found");
const errorHandler = require("./middlewares/error-handler");
// @import - Routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const aspirantRoute = require("./routes/aspirant");
const commentRoute = require("./routes/comments");
// @import - Nodemailer Transport
require("./utils/nodemailer");
// @import - MongoDB
const connectDB = require("./config/db");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine
app.engine("hbs", hbs.engine({ extname: ".hbs", defaultLayout: false }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

// Create port value
const port = process.env.PORT || 4000;

// Routes Init
app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api/aspirant", aspirantRoute);
app.use("/api/comments", commentRoute);

// Custom middlewares
app.use(notFound);
app.use(errorHandler);

// Start MongoDB & Node Server
const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};

start();

module.exports = app;