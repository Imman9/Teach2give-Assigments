import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/db";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

//  Register New User
export const signUpUser = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  try {
    const { name, email, password, role_id } = req.body;

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rowCount ?? 0 > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const defaultRoleId = 3;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role_id",
      [name, email, hashedPassword, defaultRoleId]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rowCount === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = userResult.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role_id: user.role_id },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const createUserWithRole = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  try {
    const { name, email, password, role_id } = req.body;

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rowCount ?? 0 > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role_id",
      [name, email, hashedPassword, role_id]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
