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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
console.log(`Server running on port: ${port}`);
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: "GET, PUT, DELETE",
    credentials: true,
}));
const _dirname = path_1.default.resolve();
const bookData = (0, fs_1.readFileSync)(path_1.default.join(_dirname, "src", "db", "booksData.json"), "utf-8");
const books = JSON.parse(bookData);
// get books with filtering and sorting
app.get("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
//posting a new book linked to user
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const newUser = yield db_1.default.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *", [name, email, password]);
        res.json(newUser.rows[0]);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
//get all users
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.default.query("SELECT * FROM users");
        res.json(users.rows);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
//post a new user
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const newUser = yield db_1.default.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *", [name, email, password]);
        res.json(newUser.rows[0]);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
//delete a book
app.delete("/books/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield db_1.default.query("DELETE FROM books WHERE id = $1", [id]);
        res.json({ message: "Book deleted successfully" });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
// app.get("/books", (req, res) => {
//   let filteredBooks = [...books];
//   const { year, pages, genre, sort, title } = req.query;
//   if (genre) {
//     filteredBooks = filteredBooks.filter(
//       (book) => book.genre.toLowerCase() === (genre as string).toLowerCase()
//     );
//   }
//   if (year) {
//     filteredBooks = filteredBooks.filter((book) => book.year === Number(year));
//   }
//   if (pages) {
//     filteredBooks = filteredBooks.filter((book) => book.pages <= Number(pages));
//   }
//   if (title) {
//     filteredBooks = filteredBooks.filter((book) =>
//       book.title.toLowerCase().includes((title as string).toLowerCase())
//     );
//   }
//   if (sort === "asc") {
//     filteredBooks.sort((a, b) => a.year - b.year);
//   } else if (sort === "desc") {
//     filteredBooks.sort((a, b) => b.year - a.year);
//   }
//   res.json(filteredBooks);
// });
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
