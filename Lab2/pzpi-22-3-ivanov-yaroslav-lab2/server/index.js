require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routes/index");
const errorMiddleware = require("./middlewares/errorMiddleware");
const PORT = 5000;
const app = express();
const swaggerDocs = require("./swagger");
const logger = require("./middlewares/logger");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);
app.use("/api", router);
app.use(errorMiddleware);
app.use(logger);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@arkpz.scpri.mongodb.net/?retryWrites=true&w=majority&appName=arkpz`
    );

    swaggerDocs(app, PORT);

    app.listen(PORT, () => {
      console.log(`Server started on PORT ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};
start();
