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
var _a, _b, _c, _d;
const api1 = "http://localhost:3000";
// 🟢 Save Token to Local Storage
function saveToken(token) {
    localStorage.setItem("token", token);
}
// 🟢 Handle Login
(_a = document.getElementById("login")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const email = document.getElementById("loginEmail")
        .value;
    const password = document.getElementById("loginPassword").value;
    try {
        const response = yield fetch(`${api1}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        const data = yield response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token); // Save the token
            localStorage.setItem("role", data.user.role_id); // Save the role
            window.location.href = "index.html"; // Redirect to home page
        }
        else {
            alert(data.error || "Login failed");
        }
    }
    catch (err) {
        console.error("Error during login:", err);
        alert("Server error");
    }
}));
// 🟢 Handle Signup
(_b = document.getElementById("signup")) === null || _b === void 0 ? void 0 : _b.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const name = document.getElementById("signupName")
        .value;
    const email = document.getElementById("signupEmail")
        .value;
    const password = document.getElementById("signupPassword").value;
    try {
        const response = yield fetch(`${api1}/api/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password, role_id: 2 }), // Assuming role_id 2 is for regular users
        });
        const data = yield response.json();
        if (response.ok) {
            alert("Signup successful! Please login.");
            document.getElementById("showLogin").click(); // Switch to login form
        }
        else {
            alert(data.error || "Signup failed");
        }
    }
    catch (err) {
        console.error("Error during signup:", err);
        alert("Server error");
    }
}));
// 🟢 Toggle Between Login and Signup Forms
(_c = document.getElementById("showSignup")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("loginForm").style.display =
        "none";
    document.getElementById("signupForm").style.display =
        "block";
});
(_d = document.getElementById("showLogin")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("signupForm").style.display =
        "none";
    document.getElementById("loginForm").style.display =
        "block";
});
