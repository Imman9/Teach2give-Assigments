import { Request, Response } from "express";
import { setupAliases } from "import-aliases";
setupAliases();
import pool from "@app/db/db";

export const getAvailableCopies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { book_id, status } = req.query;

    if (!book_id) {
      res.status(400).json({ error: "Book ID is required." });
      return;
    }

    const copies = await pool.query(
      `SELECT * FROM book_copies WHERE book_id = $1 AND status = $2`,
      [book_id, status || "Available"]
    );

    res.json(copies.rows);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};

// Get details of a specific book copy
export const getBookCopyById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { copy_id } = req.params;

    const copy = await pool.query(
      `SELECT * FROM book_copies WHERE copy_id = $1`,
      [copy_id]
    );

    if (copy.rows.length === 0) {
      res.status(404).json({ error: "Book copy not found" });
      return;
    }

    res.json(copy.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};

// Mark book copy as borrowed
export const markBookCopyAsBorrowed = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { copy_id } = req.body;

    const result = await pool.query(
      `UPDATE book_copies SET status = 'Borrowed' WHERE copy_id = $1 RETURNING *`,
      [copy_id]
    );

    if (result.rows.length === 0) {
      res
        .status(404)
        .json({ error: "Book copy not found or already borrowed." });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};
