import express from "express";
import { loginUser, signUpUser } from "../contollers/authController";
import { authorizeRoles } from "../middlewares/authMiddleware";
import { createUserWithRole } from "../contollers/authController";

const router = express.Router();

//  Login Route
router.post("/login", loginUser);

//  Signup Route
router.post("/signup", signUpUser);

router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

router.get("/admin/dashboard", authorizeRoles(1), (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard!" });
});

router.get("/librarian/dashboard", authorizeRoles(2), (req, res) => {
  res.json({ message: "Welcome to the Librarian Dashboard!" });
});

router.get("/borrower/dashboard", authorizeRoles(3), (req, res) => {
  res.json({ message: "Welcome to the Borrower Dashboard!" });
});

router.post("/admin/create-user", authorizeRoles(1), createUserWithRole);

export default router;
