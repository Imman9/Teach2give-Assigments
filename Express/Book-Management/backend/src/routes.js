"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_1 = require("./books");
const router = express_1.default.Router();
// Fetch all books with optional filtering
router.get("/", (req, res) => {
    let filteredBooks = books_1.books;
    if (req.query.genre) {
        filteredBooks = filteredBooks.filter((book) => book.genre === req.query.genre);
    }
    if (req.query.year) {
        filteredBooks = filteredBooks.filter((book) => book.year == Number(req.query.year));
    }
    if (req.query.pages) {
        filteredBooks = filteredBooks.filter((book) => book.pages >= Number(req.query.pages));
    }
    res.json(filteredBooks);
});
exports.default = router;
