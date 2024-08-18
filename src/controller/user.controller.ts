import { Response } from "express";
import UserModel from "../models/UserModel";
import { ExtendedAuthRequest } from "../types/globalTypes";

class UserController {
  public static async getUsers(
    req: ExtendedAuthRequest,
    res: Response
  ): Promise<Response> {
    const currentLoggedUserId = req.user?._id;

    const otherUsers = await UserModel.find({
      _id: { $ne: currentLoggedUserId },
    }).select("-password");

    return res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: otherUsers,
    });
  }
}

export default UserController;
