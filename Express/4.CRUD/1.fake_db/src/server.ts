import express from "express";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import path from "path";
import cors from "cors";
import { send } from "process";

interface Book {
  id: number;
  title: string;
  genre: string;
  year: number;
  pages: number;
}

// Configure dotenv
dotenv.config();

// Instance of express
const app = express();

// Load the variables
const port = process.env.PORT;
console.log(`Server running on port: ${port}`);

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET, PUT, DELETE",
    credentials: true, // Allows cookies and auth headers
  })
);

const _dirname = path.resolve();

// Read book data from JSON file
const bookData = readFileSync(
  path.join(_dirname, "src", "db", "booksData.json"),
  "utf-8"
);

// Parse book data into JSON
const books: Book[] = JSON.parse(bookData);

// Default route
app.get("/", (req, res) => {
  res.send("Hello world, Be HUMBLE to us");
});

//  **Updated `/all` endpoint with filtering & sorting**
app.get("/all", (req, res) => {
  let filteredBooks = books;

  const { genre, year, pages, sort } = req.query;

  // **Filtering by genre**
  if (genre) {
    filteredBooks = filteredBooks.filter(
      (book) => book.genre.toLowerCase() === (genre as string).toLowerCase()
    );
  }

  //  **Filtering by year**
  if (year) {
    filteredBooks = filteredBooks.filter((book) => book.year == Number(year));
  }

  //  **Filtering by pages (greater than or equal)**
  if (pages) {
    filteredBooks = filteredBooks.filter((book) => book.pages >= Number(pages));
  }

  //  **Sorting (year ascending or descending)**
  if (sort === "asc") {
    filteredBooks.sort((a, b) => a.year - b.year);
  } else if (sort === "desc") {
    filteredBooks.sort((a, b) => b.year - a.year);
  }

  res.json(filteredBooks);
});

app.post("/all", (req, res) => {
  res.send("success");
});

// Create server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
