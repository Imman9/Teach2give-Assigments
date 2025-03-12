import { Router } from "express";
import { borrowBook } from "../contollers/borrrowController";

const router = Router();

router.post("/", borrowBook);

export default router;
