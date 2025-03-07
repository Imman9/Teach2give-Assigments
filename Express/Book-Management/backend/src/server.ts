import express from "express";
import dotenv from "dotenv";

import cors from "cors";
import pool from "./db/db";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // Parse JSON request bodies

console.log(`Server running on port: ${port}`);

app.get("/books", async (req, res) => {
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
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});
//posting a book
app.post("/books", async (req, res) => {
  try {
    const { title, author, genre, year, pages, cost, image } = req.body;
    const newBook = await pool.query(
      "INSERT INTO books (title, author, genre, year, pages, cost, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [title, author, genre, year, pages, cost, image]
    );
    res.json(newBook.rows[0]);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

//posting a new book linked to user
app.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});
//get all users
app.get("/users", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.json(users.rows);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});
//post a new user
app.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

//delete a book
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM books WHERE id = $1", [id]);
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
