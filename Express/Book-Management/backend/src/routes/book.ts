import { Router } from "express";
import {
  getAllBooks,
  getOneBook,
  postNewBook,
  fullyUpdateBook,
  partillyUpdateBook,
  deleteBook,
} from "../contollers/bookController";
import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddleware";
const router = Router();

// Getting all books
router.get("/", getAllBooks);
//get one book
router.get("/:book_id", getOneBook);
// Posting a new book
router.post("/", authenticateUser, authorizeRoles(1), postNewBook);

// Updating a book
router.put(
  "/:book_id",
  authenticateUser,
  authorizeRoles(1, 2),
  fullyUpdateBook
);
// PATCH a book
router.patch(
  "/:book_id",
  authenticateUser,
  authorizeRoles(1, 2),
  partillyUpdateBook
);

// Deleting a book
router.delete("/:book_id", authenticateUser, authorizeRoles(1, 2), deleteBook);

export default router;
