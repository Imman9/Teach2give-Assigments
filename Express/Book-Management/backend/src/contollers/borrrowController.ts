import { Request, Response } from "express";
import pool from "../db/db";

//  Borrow a book
export const requestBorrowBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id, copy_id, librarian_id, return_date } = req.body;

    //  Check if book copy is available
    const copyCheck = await pool.query(
      `SELECT status, book_id FROM book_copies WHERE copy_id = $1`,
      [copy_id]
    );

    if (copyCheck.rows.length === 0) {
      res.status(400).json({ error: "Book copy not found" });
      return;
    }

    const { status: copyStatus, book_id } = copyCheck.rows[0];

    if (copyStatus !== "Available") {
      res
        .status(400)
        .json({ error: "This book copy is not available for borrowing" });
      return;
    }

    //  Create a borrowing record
    const borrowRequest = await pool.query(
      `INSERT INTO borrowers (user_id, copy_id, librarian_id, return_date, status) 
       VALUES ($1, $2, $3, $4, 'Pending') RETURNING *`,
      [user_id, copy_id, librarian_id, return_date]
    );

    res.json({ message: "Borrow request sent!", data: borrowRequest.rows[0] });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};

export const updateBorrowStatus = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  try {
    const { id } = req.params; // Borrow record ID
    const { status } = req.body; // New status

    // Ensure status is valid
    const validStatuses = ["Borrowed", "Returned", "Overdue"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status update." });
    }

    // Update the borrow record
    const result = await pool.query(
      "UPDATE borrowers SET status = $1, return_date = CASE WHEN $1 = 'Returned' THEN NOW() ELSE return_date END WHERE borrower_id = $2 RETURNING *",
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Borrow record not found." });
    }

    res.json({
      message: "Borrow status updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllBorrowingRecords = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        borrowers.borrower_id,
        borrowers.user_id AS borrower_id,
        users.name AS borrower_name,
        borrowers.librarian_id,
        librarian.name AS librarian_name,
        borrowers.copy_id,
        book_copies.book_id,
        books.title,
        borrowers.borrow_date,
        borrowers.return_date,
        borrowers.status,
        borrowers.created_at
      FROM borrowers
      JOIN book_copies ON borrowers.copy_id = book_copies.copy_id
      JOIN books ON book_copies.book_id = books.book_id
      JOIN users ON borrowers.user_id = users.user_id
      LEFT JOIN users AS librarian ON borrowers.librarian_id = librarian.user_id
      ORDER BY borrowers.borrow_date DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};

export const getBorrowedBooksByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id } = req.params;

    const result = await pool.query(
      `
      SELECT 
        borrowers.borrower_id,
        borrowers.copy_id,
        books.title,
        borrowers.borrow_date,
        borrowers.return_date,
        borrowers.status
      FROM borrowers
      JOIN book_copies ON borrowers.copy_id = book_copies.copy_id
      JOIN books ON book_copies.book_id = books.book_id
      WHERE borrowers.user_id = $1
      ORDER BY borrowers.borrow_date DESC;
    `,
      [user_id]
    );

    if (result.rows.length === 0) {
      res
        .status(404)
        .json({ message: "No borrowed books found for this user." });
      return;
    }

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};

export const returnBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { copy_id } = req.params;

    // Check if the book copy exists & is borrowed
    const copyCheck = await pool.query(
      `
      SELECT status, book_id FROM book_copies WHERE copy_id = $1
    `,
      [copy_id]
    );

    if (copyCheck.rows.length === 0) {
      res.status(404).json({ error: "Book copy not found" });
      return;
    }

    const { status: copyStatus, book_id } = copyCheck.rows[0];

    if (copyStatus !== "Borrowed") {
      res
        .status(400)
        .json({ error: "This book copy is not currently borrowed." });
      return;
    }

    // Step 1: Update Borrowing Record to 'Returned'
    const result = await pool.query(
      `
      UPDATE borrowers 
      SET status = 'Returned', return_date = NOW() 
      WHERE copy_id = $1 AND status = 'Borrowed'
      RETURNING *;
    `,
      [copy_id]
    );

    if (result.rowCount === 0) {
      res.status(400).json({ error: "Could not update the borrow record." });
      return;
    }

    // Step 2: Mark Book Copy as Available
    await pool.query(
      `
      UPDATE book_copies 
      SET status = 'Available' 
      WHERE copy_id = $1;
    `,
      [copy_id]
    );

    // Step 3: Increment available_copies in Books Table
    await pool.query(
      `
      UPDATE books 
      SET available_copies = available_copies + 1 
      WHERE book_id = $1;
    `,
      [book_id]
    );

    res.json({ message: "Book returned successfully!" });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};
export const getPendingBorrowRequests = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT borrowers.borrower_id, borrowers.copy_id, books.title, users.name AS borrower_name, borrowers.borrow_date
      FROM borrowers
      JOIN book_copies ON borrowers.copy_id = book_copies.copy_id
      JOIN books ON book_copies.book_id = books.book_id
      JOIN users ON borrowers.user_id = users.user_id
      WHERE borrowers.status = 'Pending'
      ORDER BY borrowers.borrow_date ASC;
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An error occurred",
    });
  }
};

export const approveBorrowRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { borrower_id } = req.params;

    // Check if the request is valid
    const requestCheck = await pool.query(
      `SELECT copy_id FROM borrowers WHERE borrower_id = $1 AND status = 'Pending'`,
      [borrower_id]
    );

    if (requestCheck.rows.length === 0) {
      res.status(400).json({ error: "No pending request found" });
      return;
    }

    const { copy_id } = requestCheck.rows[0];

    // Update borrower record to "Borrowed"
    const approvedRequest = await pool.query(
      `UPDATE borrowers SET status = 'Borrowed' WHERE borrower_id = $1 RETURNING *`,
      [borrower_id]
    );

    // Mark book copy as "Borrowed"
    await pool.query(
      `UPDATE book_copies SET status = 'Borrowed' WHERE copy_id = $1`,
      [copy_id]
    );

    res.json({
      message: "Borrow request approved!",
      data: approvedRequest.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An error occurred",
    });
  }
};

export const processReturn = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { copy_id } = req.params;

    // Update borrower record
    const result = await pool.query(
      `
      UPDATE borrowers 
      SET status = 'Returned', return_date = NOW() 
      WHERE copy_id = $1 AND status = 'Borrowed'
      RETURNING *;
    `,
      [copy_id]
    );

    if (result.rowCount === 0) {
      res.status(400).json({ error: "Book is not currently borrowed." });
      return;
    }

    // Mark book copy as available
    await pool.query(
      `
      UPDATE book_copies 
      SET status = 'Available' 
      WHERE copy_id = $1;
    `,
      [copy_id]
    );

    res.json({ message: "Book returned successfully!" });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An error occurred",
    });
  }
};

export const rejectBorrowRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { borrower_id } = req.params;

    // Check if request exists
    const requestCheck = await pool.query(
      `SELECT copy_id FROM borrowers WHERE borrower_id = $1 AND status = 'Pending'`,
      [borrower_id]
    );

    if (requestCheck.rows.length === 0) {
      res.status(400).json({ error: "No pending request found" });
      return;
    }

    // Delete the borrow request
    await pool.query(`DELETE FROM borrowers WHERE borrower_id = $1`, [
      borrower_id,
    ]);

    res.json({ message: "Borrow request rejected." });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An error occurred",
    });
  }
};
