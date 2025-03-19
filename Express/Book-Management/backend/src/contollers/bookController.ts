import { Request, Response } from "express";
import pool from "../db/db";

//getting all books
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    let query = "SELECT * FROM books";
    const filters: string[] = [];
    const values: any[] = [];

    const { year, pages, genre, sort, title } = req.query;

    if (genre) {
      values.push(genre);
      filters.push(`genre ILIKE $${values.length}`);
    }

    if (year) {
      values.push(Number(year));
      filters.push(`year = $${values.length}`);
    }

    if (pages) {
      values.push(Number(pages));
      filters.push(`pages <= $${values.length}`);
    }

    if (title) {
      values.push(`%${title}%`);
      filters.push(`title ILIKE $${values.length}`);
    }

    if (filters.length > 0) {
      query += ` WHERE ${filters.join(" AND ")}`;
    }

    if (sort === "asc") {
      query += " ORDER BY year ASC";
    } else if (sort === "desc") {
      query += " ORDER BY year DESC";
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};

//  Get one book by ID
export const getOneBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { book_id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM books WHERE book_id=$1", [
      book_id,
    ]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};

// Add a new book
export const postNewBook = async (req: Request, res: Response) => {
  try {
    const {
      title,
      author,
      genre,
      year,
      pages,
      publisher,
      description,
      image,
      cost,
      total_copies,
    } = req.body;

    const created_by = (req as any).user?.user_id;

    const newBook = await pool.query(
      `INSERT INTO books (title, author, genre, year, pages, publisher, description, image, cost, created_by,total_copies, available_copies) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$11) RETURNING *`,
      [
        title,
        author,
        genre,
        year,
        pages,
        publisher,
        description,
        image,
        cost,
        created_by,
        total_copies,
      ]
    );

    const book_id = newBook.rows[0].book_id;

    //  Generate book copies
    for (let i = 0; i < total_copies; i++) {
      await pool.query(
        `INSERT INTO book_copies (book_id, inventory_number, condition, status, location) 
         VALUES ($1, $2, $3, $4, $5)`,
        [
          book_id,
          `INV-${book_id}-${i + 1}`,
          "New",
          "Available",
          "Library Shelf",
        ]
      );
    }

    res.json(newBook.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};

// Fully update a book
export const fullyUpdateBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { book_id } = req.params;
    const {
      title,
      author,
      genre,
      year,
      pages,
      publisher,
      description,
      image,
      cost,
      total_copies,
    } = req.body;

    const updatedBook = await pool.query(
      `UPDATE books 
   SET title = $1, author = $2, genre = $3, year = $4, pages = $5, 
       publisher = $6, description = $7, image = $8, cost = $9, 
       total_copies = $10, available_copies = $10 - (total_copies - $10)
   WHERE book_id = $11 RETURNING *`,
      [
        title,
        author,
        genre,
        year,
        pages,
        publisher,
        description,
        image,
        cost,
        total_copies,
        book_id,
      ]
    );

    if (updatedBook.rows.length === 0) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    res.json(updatedBook.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};

//  Partially update a book
export const partillyUpdateBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { book_id } = req.params;
    const {
      title,
      author,
      genre,
      year,
      pages,
      publisher,
      description,
      image,
      cost,
      total_copies,
    } = req.body;

    // If no fields are provided, return an error
    if (
      !title &&
      !author &&
      !genre &&
      !year &&
      !pages &&
      !publisher &&
      !description &&
      !image &&
      !cost &&
      !total_copies
    ) {
      res
        .status(400)
        .json({ error: "At least one field must be provided for update." });
      return;
    }

    const result = await pool.query(
      `UPDATE books 
       SET 
           title = COALESCE($1, title),
           author = COALESCE($2, author),
           genre = COALESCE($3, genre),
           year = COALESCE($4, year),
           pages = COALESCE($5, pages),
           publisher = COALESCE($6, publisher),
           description = COALESCE($7, description),
           image = COALESCE($8, image),
           cost = COALESCE($9, cost),
           total_copies = COALESCE($10, total_copies),
           updated_at = NOW()
       WHERE book_id = $11 RETURNING *`,
      [
        title,
        author,
        genre,
        year,
        pages,
        publisher,
        description,
        image,
        cost,
        total_copies,
        book_id,
      ]
    );

    // If no rows were updated, return an error
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Book not found or no changes applied." });
      return;
    }

    res.json({ message: "Book updated successfully", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Error updating book",
    });
  }
};

// Delete a book
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { book_id } = req.params;
    await pool.query("DELETE FROM books WHERE book_id = $1", [book_id]);
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};
