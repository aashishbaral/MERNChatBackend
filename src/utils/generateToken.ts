import { Response } from "express";
import jwt from "jsonwebtoken";

const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "15d",
  });

  res.cookie("token", token, {
    httpOnly: true, // cookie cannot be accessed by client-side scripts (XSS protection)
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    sameSite: "strict", // cookie is sent only to the same site as the domain in the address bar (CSRF protection)
    secure: process.env.NODE_ENV !== "development", // cookie is sent only over HTTPS (secure connection)
  });
};

export default generateToken;
