"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
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
app.get("/books", (req, res) => {
    let filteredBooks = [...books];
    const { year, pages, genre, sort, title } = req.query;
    if (genre) {
        filteredBooks = filteredBooks.filter((book) => book.genre.toLowerCase() === genre.toLowerCase());
    }
    if (year) {
        filteredBooks = filteredBooks.filter((book) => book.year === Number(year));
    }
    if (pages) {
        filteredBooks = filteredBooks.filter((book) => book.pages <= Number(pages));
    }
    if (title) {
        filteredBooks = filteredBooks.filter((book) => book.title.toLowerCase().includes(title.toLowerCase()));
    }
    if (sort === "asc") {
        filteredBooks.sort((a, b) => a.year - b.year);
    }
    else if (sort === "desc") {
        filteredBooks.sort((a, b) => b.year - a.year);
    }
    res.json(filteredBooks);
});
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
