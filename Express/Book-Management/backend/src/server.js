"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const book_1 = __importDefault(require("./routes/book"));
const users_1 = __importDefault(require("./routes/users"));
const borrow_1 = __importDefault(require("./routes/borrow"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true }));
app.use(express_1.default.json()); // Parse JSON request bodies
console.log(`Server running on port: ${port}`);
//routes
app.use("/books", book_1.default);
app.use("/users", users_1.default);
app.use("/borrow", borrow_1.default);
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
