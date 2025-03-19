import express from "express";
import {
  getAvailableCopies,
  getBookCopyById,
  markBookCopyAsBorrowed,
} from "../contollers/bookCopiesControllers";

const router = express.Router();

// Route to fetch available book copies by book_id
router.get("/", getAvailableCopies);

// Route to fetch a specific book copy by copy_id
router.get("/:copy_id", getBookCopyById);

// Route to mark a book copy as borrowed
router.patch("/borrow", markBookCopyAsBorrowed);

export default router;
