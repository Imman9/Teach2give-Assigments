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
const bcrypt = require("bcrypt");
// Getting all users
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.default.query("SELECT * FROM users");
        res.json(users.rows);
    }
    catch (err) {
        res.status(500).json({
            error: err instanceof Error ? err.message : "An unknown error occurred",
        });
    }
}));
// Posting a new user (
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role_id } = req.body;
        const saltRounds = 10;
        const hashedPassword = yield bcrypt.hash(password, saltRounds);
        const newUser = yield db_1.default.query(`INSERT INTO users (name, email, password, role_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`, [name, email, hashedPassword, role_id || null]);
        res.json(newUser.rows[0]);
    }
    catch (err) {
        res.status(500).json({
            error: err instanceof Error ? err.message : "An unknown error occurred",
        });
    }
}));
// DELETE a user by ID
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const result = yield db_1.default.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [userId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Error deleting user" });
    }
}));
// PATCH a user
router.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const { name, email, role_id } = req.body;
    try {
        const result = yield db_1.default.query(`UPDATE users SET 
                name = COALESCE($1, name),
                email = COALESCE($2, email),
                role_id = COALESCE($3, role_id)
            WHERE user_id = $4 RETURNING *`, [name, email, role_id, userId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: "Error updating user" });
    }
}));
exports.default = router;
