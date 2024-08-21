import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./database/databaseConfig";
import userRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import usersRoutes from "./routes/users.routes";
import { app, server } from "./socket/socket";

dotenv.config();

app.use(express.json()); // to parse incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173", // Your Vite dev server URL
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.use("/api/auth", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/users", usersRoutes);

server.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
