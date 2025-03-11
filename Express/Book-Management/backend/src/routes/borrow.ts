import { Router } from "express";
import pool from "../db/db";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { user_id, book_id, librarian_id, return_date, status } = req.body;

    const borrow = await pool.query(
      `INSERT INTO borrowers (user_id, book_id, librarian_id, return_date, status) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, book_id, librarian_id, return_date, status]
    );

    res.json(borrow.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
});

export default router;
