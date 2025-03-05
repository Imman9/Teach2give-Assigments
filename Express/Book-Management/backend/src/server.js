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
// Configure dotenv
dotenv_1.default.config();
// Instance of express
const app = (0, express_1.default)();
// Load the variables
const port = process.env.PORT;
console.log(`Server running on port: ${port}`);
// Enable CORS
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: "GET, PUT, DELETE",
    credentials: true, // Allows cookies and auth headers
}));
const _dirname = path_1.default.resolve();
// Read book data from JSON file
const bookData = (0, fs_1.readFileSync)(path_1.default.join(_dirname, "src", "db", "booksData.json"), "utf-8");
// Parse book data into JSON
const books = JSON.parse(bookData);
// Default route
app.get("/", (req, res) => {
    res.send("Hello world, Be HUMBLE to us");
});
// ✅ **Updated `/all` endpoint with filtering & sorting**
app.get("/all", (req, res) => {
    let filteredBooks = books;
    const { genre, year, pages, sort } = req.query;
    // 🏷️ **Filtering by genre**
    if (genre) {
        filteredBooks = filteredBooks.filter((book) => book.genre.toLowerCase() === genre.toLowerCase());
    }
    // 📅 **Filtering by year**
    if (year) {
        filteredBooks = filteredBooks.filter((book) => book.year == Number(year));
    }
    // 📖 **Filtering by pages (greater than or equal)**
    if (pages) {
        filteredBooks = filteredBooks.filter((book) => book.pages >= Number(pages));
    }
    // 🔼🔽 **Sorting (year ascending or descending)**
    if (sort === "asc") {
        filteredBooks.sort((a, b) => a.year - b.year);
    }
    else if (sort === "desc") {
        filteredBooks.sort((a, b) => b.year - a.year);
    }
    res.json(filteredBooks);
});
// Create server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
