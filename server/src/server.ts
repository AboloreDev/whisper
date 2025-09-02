import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// conffigure dotenv
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;
const APP_ORIGIN = process.env.APP_ORGIN;

// initialisation
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

// routes definition
app.get("/", (req, res) => {
  res.status(200).json({
    status: "healthy",
  });
});

//LISTEN ON PORT NUMBER
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
