import express, { Router } from "express";
import AuthController from "../controller/auth.controller";
import errorHandler from "../services/errorHandler";

const router: Router = express.Router();

router.route("/register").post(errorHandler(AuthController.registerUser));
router.route("/login").post(errorHandler(AuthController.loginUser));
router.route("/logout").get(errorHandler(AuthController.logoutUser));

export default router;
