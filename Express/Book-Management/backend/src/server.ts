import express from "express";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import path from "path";
import cors from "cors";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  year: number;
  pages: number;
  cost: number;
  image: string;
}

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;
console.log(`Server running on port: ${port}`);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET, PUT, DELETE",
    credentials: true,
  })
);

const _dirname = path.resolve();

const bookData = readFileSync(
  path.join(_dirname, "src", "db", "booksData.json"),
  "utf-8"
);

const books: Book[] = JSON.parse(bookData);

app.get("/books", (req, res) => {
  let filteredBooks = [...books];

  const { year, pages, genre, sort, title } = req.query;

  if (genre) {
    filteredBooks = filteredBooks.filter(
      (book) => book.genre.toLowerCase() === (genre as string).toLowerCase()
    );
  }

  if (year) {
    filteredBooks = filteredBooks.filter((book) => book.year === Number(year));
  }

  if (pages) {
    filteredBooks = filteredBooks.filter((book) => book.pages <= Number(pages));
  }

  if (title) {
    filteredBooks = filteredBooks.filter((book) =>
      book.title.toLowerCase().includes((title as string).toLowerCase())
    );
  }

  if (sort === "asc") {
    filteredBooks.sort((a, b) => a.year - b.year);
  } else if (sort === "desc") {
    filteredBooks.sort((a, b) => b.year - a.year);
  }

  res.json(filteredBooks);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
