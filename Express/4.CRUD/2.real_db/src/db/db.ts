import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";

const app = express();
dotenv.config();

// PostgreSQL Connection Pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Middleware to parse JSON requests
app.use(express.json());

export default pool;
