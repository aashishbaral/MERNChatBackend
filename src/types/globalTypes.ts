import { Request } from "express";
import { Gender } from "./authTypes";

export interface ExtendedAuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    username: string;
    fullName: string;
    gender: Gender;
    profilePicture: string;
  };
}
