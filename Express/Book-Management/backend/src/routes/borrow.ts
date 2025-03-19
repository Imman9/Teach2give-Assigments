import { Router } from "express";
import {
  approveBorrowRequest,
  getAllBorrowingRecords,
  getBorrowedBooksByUser,
  getPendingBorrowRequests,
  processReturn,
  rejectBorrowRequest,
  requestBorrowBook,
  returnBook,
  updateBorrowStatus,
} from "../contollers/borrrowController";
import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddleware";

const router = Router();
//get borrowing records
router.get("/", authenticateUser, authorizeRoles(1, 2), getAllBorrowingRecords);
//borrow a book
router.post("/", authenticateUser, authorizeRoles(3), requestBorrowBook);
//edit a book
router.patch("/:id", authenticateUser, authorizeRoles(2), updateBorrowStatus);
//get borrowed books by user
router.get("/user/:user_id", authorizeRoles(3), getBorrowedBooksByUser);
//return a book
router.patch("/return/:copy_id", authorizeRoles(3), returnBook);
//  View Pending Borrow Requests
router.get("/pending", authorizeRoles(2), getPendingBorrowRequests);

//  Approve Borrow Request
router.patch("/approve/:borrower_id", authorizeRoles(2), approveBorrowRequest);
//  Librarian rejects request
router.delete("/reject/:borrower_id", authorizeRoles(2), rejectBorrowRequest);

//  View Borrowed Books
router.get("/borrowed", getBorrowedBooksByUser);

//  Process Book Return
router.patch("/return/:copy_id", authorizeRoles(2), processReturn);

export default router;
