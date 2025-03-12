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

//getting one book
export const getOneBook = async (req: Request, res: Response): Promise<any> => {
  const { book_id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM books WHERE book_id=$1", [
      book_id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Books not found",
      });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};

//post a new book

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
      created_by,
    } = req.body;

    const newBook = await pool.query(
      `INSERT INTO books (title, author, genre, year, pages, publisher, description, image, cost, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
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
      ]
    );
    res.json(newBook.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};

// update a book fully using PUT

export const fullyUpdateBook = async (
  req: Request,
  res: Response
): Promise<any> => {
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
    } = req.body;

    const updatedBook = await pool.query(
      `UPDATE books 
       SET title = $1, author = $2, genre = $3, year = $4, pages = $5, 
           publisher = $6, description = $7, image = $8, cost = $9 
       WHERE book_id = $10 RETURNING *`,
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
        book_id,
      ]
    );

    if (updatedBook.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(updatedBook.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};
// partilly update a book using PATCH
export const partillyUpdateBook = async (
  req: Request,
  res: Response
): Promise<any> => {
  const bookId = req.params.id;
  const { title, author } = req.body;

  try {
    const result = await pool.query(
      `UPDATE books SET 
                title = COALESCE($1, title),
                author = COALESCE($2, author),
                updated_at = NOW()
            WHERE book_id = $3 RETURNING *`,
      [title, author, bookId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error updating book" });
  }
};

//deleting a book

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
