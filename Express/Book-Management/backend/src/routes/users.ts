import { Request, Response } from "express";
import pool from "../db/db";
import { Router } from "express";

const router = Router();
const bcrypt = require("bcrypt");

// Getting all users
router.get("/", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.json(users.rows);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
});

// Posting a new user (
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, role_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, hashedPassword, role_id || null]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
});

// DELETE a user by ID

router.delete("/:id", async (req: Request, res: Response): Promise<any> => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING *",
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

// PATCH a user

router.patch("/:id", async (req: Request, res: Response): Promise<any> => {
  const userId = req.params.id;
  const { name, email, role_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET 
                name = COALESCE($1, name),
                email = COALESCE($2, email),
                role_id = COALESCE($3, role_id)
            WHERE user_id = $4 RETURNING *`,
      [name, email, role_id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
});

export default router;
