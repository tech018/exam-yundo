import UserModel from "../models/users";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const JWT_KEY = process.env.SECRET_TOKEN as Secret;

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization?.startsWith("Bearer");
  const apiKey = req.headers.apikey;
  if (apiKey !== process.env.apiKey) {
    res
      .status(403)
      .json({ message: "Application key is invalid or not found" });
  }
  if (!authHeader) {
    res.status(404).json({ message: "Token not found" });
  }
  try {
    const token = req.headers.authorization?.split(" ")[1] as string;

    const decoded = jwt.verify(token, JWT_KEY) as JwtPayload;

    if (Date.now() >= decoded.exp! * 1000) {
      return res.status(403).json({ message: "Token is expired" });
    }

    const checkEmail = await UserModel.findOne({
      where: {
        email: decoded.userInfo.email,
      },
    });

    if (!checkEmail) {
      res.status(404).json({ message: "Email from token cannot be found" });
    }

    if (decoded) {
      next();
    } else {
      res.status(400).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default verifyToken;
