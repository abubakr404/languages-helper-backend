require("dotenv").config();
require("express-async-errors");

// extra security packages
const helmet = require("helmet");
const cros = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

// connect DB
const connectDB = require("./db/connect");

// Routers
const authRouter = require("./routes/auth");
const wordsRouter = require("./routes/words");
const generalWordsRouter = require("./routes/generalWord");

// Authentication
const authUser = require("./middleware/authentication");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust porxy", 1);
app.use(rateLimiter({ windowMs: 15 * 60 * 60 * 1000, max: 300 }));
app.use(express.json());
app.use(helmet());
app.use(cros());
app.use(xss());
// extra packages

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/words", authUser, wordsRouter);
app.use("/api/v1/general-words", authUser, generalWordsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // connect DB
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
