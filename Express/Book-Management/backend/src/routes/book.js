"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db/db"));
const express_1 = require("express");
const router = (0, express_1.Router)();
// Getting all books
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = "SELECT * FROM books";
        const filters = [];
        const values = [];
        const { year, pages, genre, sort, title } = req.query;
        if (genre) {
            values.push(genre);
            filters.push(`genre ILIKE $${values.length}`);
        }
        if (year) {
            values.push(Number(year));
            filters.push(`year = $${values.length}`);
        }
        if (pages) {
            values.push(Number(pages));
            filters.push(`pages <= $${values.length}`);
        }
        if (title) {
            values.push(`%${title}%`);
            filters.push(`title ILIKE $${values.length}`);
        }
        if (filters.length > 0) {
            query += ` WHERE ${filters.join(" AND ")}`;
        }
        if (sort === "asc") {
            query += " ORDER BY year ASC";
        }
        else if (sort === "desc") {
            query += " ORDER BY year DESC";
        }
        const result = yield db_1.default.query(query, values);
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({
            error: err instanceof Error ? err.message : "An unknown error occurred",
        });
    }
}));
// Posting a new book
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, author, genre, year, pages, publisher, description, image, cost, created_by, } = req.body;
        const newBook = yield db_1.default.query(`INSERT INTO books (title, author, genre, year, pages, publisher, description, image, cost, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [
            title,
            author,
            genre,
            year,
            pages,
            publisher,
            description,
            image,
            cost,
            created_by,
        ]);
        res.json(newBook.rows[0]);
    }
    catch (err) {
        res.status(500).json({
            error: err instanceof Error ? err.message : "An unknown error occurred",
        });
    }
}));
// Updating a book
router.put("/:book_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book_id } = req.params;
        const { title, author, genre, year, pages, publisher, description, image, cost, } = req.body;
        const updatedBook = yield db_1.default.query(`UPDATE books 
       SET title = $1, author = $2, genre = $3, year = $4, pages = $5, 
           publisher = $6, description = $7, image = $8, cost = $9 
       WHERE book_id = $10 RETURNING *`, [
            title,
            author,
            genre,
            year,
            pages,
            publisher,
            description,
            image,
            cost,
            book_id,
        ]);
        if (updatedBook.rows.length === 0) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.json(updatedBook.rows[0]);
    }
    catch (err) {
        res.status(500).json({
            error: err instanceof Error ? err.message : "An unknown error occurred",
        });
    }
}));
// PATCH a book
router.patch("/:book_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.id;
    const { title, author } = req.body;
    try {
        const result = yield db_1.default.query(`UPDATE books SET 
                title = COALESCE($1, title),
                author = COALESCE($2, author),
                updated_at = NOW()
            WHERE book_id = $3 RETURNING *`, [title, author, bookId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: "Error updating book" });
    }
}));
// Deleting a book
router.delete("/:book_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book_id } = req.params;
        yield db_1.default.query("DELETE FROM books WHERE book_id = $1", [book_id]);
        res.json({ message: "Book deleted successfully" });
    }
    catch (err) {
        res.status(500).json({
            error: err instanceof Error ? err.message : "An unknown error occurred",
        });
    }
}));
exports.default = router;
