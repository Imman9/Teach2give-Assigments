import express, { Request, Response } from "express";
import { books, Book } from "./books";

const router = express.Router();

// Fetch all books with optional filtering
router.get("/", (req: Request, res: Response) => {
  let filteredBooks: Book[] = books;

  if (req.query.genre) {
    filteredBooks = filteredBooks.filter(
      (book) => book.genre === req.query.genre
    );
  }

  if (req.query.year) {
    filteredBooks = filteredBooks.filter(
      (book) => book.year == Number(req.query.year)
    );
  }

  if (req.query.pages) {
    filteredBooks = filteredBooks.filter(
      (book) => book.pages >= Number(req.query.pages)
    );
  }

  res.json(filteredBooks);
});

export default router;
