import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { OK } from "./constants/httpStatus";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";
import { connectDb } from "./lib/connectDb";

// confgure
dotenv.config();

const PORT = process.env.PORT;
const APP_ORIGIN = process.env.APP_ORIGIN;

const app = express();

// initialisation
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

// routes definition
app.get("/", (req, res) => {
  res.status(OK).json({
    status: "healthy",
  });
});

// Lets kick off!
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

//LISTEN ON PORT NUMBER
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
  connectDb();
});
