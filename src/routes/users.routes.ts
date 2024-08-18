import express from "express";
import UserController from "../controller/user.controller";
import authMiddleware from "../middleware/authMiddleware";
import errorHandler from "../services/errorHandler";

const router = express.Router();

router
  .route("/")
  .get(authMiddleware.isAuthenticated, errorHandler(UserController.getUsers));

export default router;
