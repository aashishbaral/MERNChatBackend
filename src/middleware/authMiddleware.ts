import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";
import { ExtendedAuthRequest } from "../types/globalTypes";

class AuthMiddleWare {
  async isAuthenticated(
    req: ExtendedAuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ status: false, message: "Unauthorized" });
      }

      jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        async (err: jwt.VerifyErrors | null, decoded: any) => {
          if (err) {
            return res
              .status(401)
              .json({ status: false, message: "Unauthorized" });
          } else {
            try {
              const user = await UserModel.findById(decoded.userId).select(
                "-password"
              );

              if (!user) {
                return res
                  .status(404)
                  .json({ status: false, message: "User not found" });
              }
              req.user = user.toObject();
              next();
            } catch (error) {
              res
                .status(500)
                .json({ status: "false", message: "Internal server error" });
            }
          }
        }
      );
    } catch (error) {
      return res.status(500).json({
        status: "false",
        message: "Internal server error",
        errorMessage: (error as Error).message,
      });
    }
  }
}

export default new AuthMiddleWare();
