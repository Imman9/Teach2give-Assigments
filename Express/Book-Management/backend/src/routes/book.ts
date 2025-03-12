import { Router } from "express";
import {
  getAllBooks,
  getOneBook,
  postNewBook,
  fullyUpdateBook,
  partillyUpdateBook,
  deleteBook,
} from "../contollers/bookController";

const router = Router();

// Getting all books
router.get("/", getAllBooks);
//get one book
router.get("/:book_id", getOneBook);
// Posting a new book
router.post("/", postNewBook);

// Updating a book
router.put("/:book_id", fullyUpdateBook);
// PATCH a book
router.patch("/:book_id", partillyUpdateBook);

// Deleting a book
router.delete("/:book_id", deleteBook);

export default router;
