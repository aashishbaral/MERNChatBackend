import express, { Router } from "express";
import MessageController from "../controller/message.controller";
import authMiddleware from "../middleware/authMiddleware";
import errorHandler from "../services/errorHandler";

const router: Router = express.Router();

router.get(
  "/:id",
  authMiddleware.isAuthenticated,
  errorHandler(MessageController.getMessages)
);

router.post(
  "/send/:id",
  authMiddleware.isAuthenticated,
  errorHandler(MessageController.sendMessage)
);

export default router;
