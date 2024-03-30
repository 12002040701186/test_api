import express from "express";
const app = express();
import dotenv from "dotenv";
import "express-async-errors"; // replace try-catch in error handler
dotenv.config();
// import errorHandler from "./middleware/error-handler.js";
// import notFound from "./middleware/not-found.js";
import connectDB from "./db/connect.js";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize"
// import { authRouter } from "./routes/index.js";
import {authRouter , postRouter , commentRouter } from "./routes/index.js";
import errorHandler from "./middleware/error-handler.js";
import notFound from "./middleware/not-found.js";
app.use(express.json());
 app.use(express.urlencoded({ extended: true }))
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use("/api/v1", authRouter);
app.use("/api/v1/posts",postRouter);
app.use("/api/v1/comment",commentRouter);
app.use(errorHandler);
app.use(notFound);
const start = async () => {
    try {
      await connectDB(process.env.MONGO_URL);
      const port = process.env.PORT || 5000;
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log("database not connected");
    }
  };
  start();