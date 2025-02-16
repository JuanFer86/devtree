import { Request, Response, NextFunction } from "express";
import UserModel, { IUser } from "../models/User";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    const error = new Error("Token not provided");
    res.status(401).json({ error: error.message });
    return;
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    const error = new Error("not authorized");
    res.status(401).json({ error: error.message });
    return;
  }

  try {
    const result = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof result === "object" && result.id) {
      const user = await UserModel.findById(result.id).select(
        // "name handle email"
        "-password"
      );
      if (!user) {
        const error = new Error("User not found");
        res.status(404).json({ error: error.message });
        return;
      }
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(500).json({ error: "Token not valid" });
  }
};
