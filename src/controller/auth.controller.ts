import bcrypt from "bcrypt";
import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import generateToken from "../utils/generateToken";

class AuthController {
  public static async registerUser(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { fullName, email, username, password, gender } = req.body;

    if (!fullName || !username || !password || !gender || !email) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ message: "User with that email already exists" });
    }

    const userNameCheck = await UserModel.findOne({ username });

    if (userNameCheck) {
      return res
        .status(400)
        .json({ message: "Username already exists !! Try other username" });
    }

    // create a hash of the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //default profile picture
    const boyProfilePicture =
      "https://avatar.iran.liara.run/public/boy?username=" + username;
    const girlProfilePicture =
      "https://avatar.iran.liara.run/public/girl?username=" + username;

    const newUser = new UserModel({
      fullName,
      email,
      username,
      password: passwordHash,
      gender,
      profilePicture:
        gender === "male" ? boyProfilePicture : girlProfilePicture,
    });

    if (newUser) {
      // generate a token using jwt

      generateToken(newUser._id.toString(), res);

      await newUser.save().catch((err) => {
        console.log(err);
      });

      return res.status(201).json({
        status: "true",
        message: "User registered successfully",
        data: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          username: newUser.username,
          profilePicture: newUser.profilePicture,
        },
      });
    } else {
      return res.status(500).json({
        status: "false",
        message: "Something went wrong",
      });
    }
  }

  public static async loginUser(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ status: "false", message: "Invalid email or password" });
    }

    const passwordCheck = await bcrypt.compare(
      password,
      user.password as string
    );

    if (!passwordCheck) {
      return res
        .status(400)
        .json({ status: "false", message: "Invalid email or password" });
    }

    generateToken(user._id.toString(), res);

    return res.status(200).json({
      status: "true",
      message: "User logged in successfully",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
      },
    });
  }

  public static logoutUser(req: Request, res: Response): void {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ status: "true", message: "User logged out" });
  }
}

export default AuthController;
