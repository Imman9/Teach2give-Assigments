import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import bookRoutes from "./routes/book";
import userRoutes from "./routes/users";
import borrowRoutes from "./routes/borrow";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // Parse JSON request bodies

console.log(`Server running on port: ${port}`);

//routes
app.use("/books", bookRoutes);
app.use("/users", userRoutes);
app.use("/borrow", borrowRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
