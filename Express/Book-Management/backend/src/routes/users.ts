import { Router } from "express";
import {
  getAllUsers,
  patchUser,
  postUser,
  deleteUser,
} from "../contollers/userController";

const router = Router();

// Getting all users
router.get("/", getAllUsers);

// Posting a new user (
router.post("/", postUser);

// DELETE a user by ID

router.delete("/:id", deleteUser);

// PATCH a user
router.patch("/:id", patchUser);

export default router;
