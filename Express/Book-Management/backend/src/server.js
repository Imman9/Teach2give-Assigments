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
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true }));
app.use(express_1.default.json()); // Parse JSON request bodies
console.log(`Server running on port: ${port}`);
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
//posting a book
app.post("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, author, genre, year, pages, cost, image } = req.body;
        const newBook = yield db_1.default.query("INSERT INTO books (title, author, genre, year, pages, cost, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [title, author, genre, year, pages, cost, image]);
        res.json(newBook.rows[0]);
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
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
