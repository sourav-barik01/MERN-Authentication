import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

// const allowedOrigin = ['http://localhost:5173']
app.use(cors({origin: '*', credentials: true}));     // so that we can send cookies in the response from express app
app.use(express.json());    // Req will be parsed using JSON
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store'); // never cache any API response
  next();
});
// API Endpoints
app.get("/", (req, res) => {
    res.status(200).send("API Working for GET Request")
})
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
    console.log(`Server Started on PORT: ${PORT}`);
})
