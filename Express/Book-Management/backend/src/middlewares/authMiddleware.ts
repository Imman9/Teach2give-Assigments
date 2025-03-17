import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
// Extend the Request type to include `user`

interface AuthRequest extends Request {
  user?: {
    user_id: number;
    email: string;
    role_id: number;
  };
}

//  Middleware to Authenticate User
export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as AuthRequest["user"];
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
// Middleware for role-based access control
export const authorizeRoles = (...allowedRoles: number[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(403).json({ error: "User not authenticated." });
      return;
    }

    if (!allowedRoles.includes(req.user.role_id)) {
      res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions." });
      return;
    }

    next();
  };
};
