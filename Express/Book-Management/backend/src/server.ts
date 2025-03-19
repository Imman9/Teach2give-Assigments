import { setupAliases } from "import-aliases";
setupAliases();
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import bookRoutes from "@app/routes/book";
import userRoutes from "@app/routes/users";
import borrowRoutes from "@app/routes/borrow";
import authRoutes from "@app/routes/authRoutes";
import bookCopiesRoutes from "./routes/bookCopiesRoutes";

import { authenticateUser } from "./middlewares/authMiddleware";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({ origin: "http://localhost:5174", credentials: true }));

//  Security middleware
app.use(helmet());

//  Logging middleware
app.use(morgan("dev"));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", authenticateUser, userRoutes);
app.use("/api/borrow", authenticateUser, borrowRoutes);
app.use("/api/book_copies", bookCopiesRoutes);

//  Handle 404 errors
app.use(notFound);

//  Global Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
