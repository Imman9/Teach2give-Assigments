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
const api = "http://localhost:3000/books";
let cart = [];
const cartContainer = document.querySelector(".cart-items");
const countElement = document.getElementById("count");
function fetchData() {
    return __awaiter(this, arguments, void 0, function* (params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const res = yield fetch(`${api}?${queryString}`);
            const data = yield res.json();
            return data;
        }
        catch (err) {
            console.error("Error fetching data: ", err);
            return null;
        }
    });
}
function displayAllBooks(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const booksContainer = document.getElementById("booksContainer");
        booksContainer.innerHTML = "";
        if (!data || data.length === 0) {
            document.getElementById("errorMsg").style.display = "block";
            return;
        }
        document.getElementById("errorMsg").style.display = "none";
        data.forEach((book) => {
            const card = document.createElement("div");
            card.classList.add("book");
            card.innerHTML = `
        <img src="${book.image}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>Year:</strong> ${book.year}</p>
        <p><strong>Pages:</strong> ${book.pages}</p>
        <button class="shop-now">Buy Now <h2><strong>$${book.cost}</strong></h2></button>
    `;
            booksContainer.appendChild(card);
            const buyBtn = card.querySelector(".shop-now");
            buyBtn.addEventListener("click", () => {
                addToCart(book);
            });
        });
    });
}
(_a = document
    .getElementById("genreFilter")) === null || _a === void 0 ? void 0 : _a.addEventListener("change", (event) => __awaiter(void 0, void 0, void 0, function* () {
    const selectedGenre = event.target.value;
    const data = yield fetchData(selectedGenre ? { genre: selectedGenre } : {});
    displayAllBooks(data);
}));
(_b = document.getElementById("searchInput")) === null || _b === void 0 ? void 0 : _b.addEventListener("input", () => __awaiter(void 0, void 0, void 0, function* () {
    const query = document.getElementById("searchInput").value.trim();
    const data = yield fetchData(query ? { title: query } : {});
    displayAllBooks(data);
}));
(_c = document.getElementById("sortAsc")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetchData({ sort: "asc" });
    displayAllBooks(data);
}));
(_d = document.getElementById("sortDesc")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetchData({ sort: "desc" });
    displayAllBooks(data);
}));
function initial() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fetchData();
        displayAllBooks(data);
    });
}
initial();
// Cart Functions
const cartCard = document.getElementById("cart");
const cartToggle = document.getElementById("toggleCartBtn");
cartToggle.addEventListener("click", function () {
    cartCard.style.display =
        cartCard.style.display === "block" ? "none" : "block";
});
function addToCart(book) {
    const existingItem = cart.find((item) => item.title === book.title);
    if (existingItem) {
        existingItem.quantity++;
    }
    else {
        cart.push(Object.assign(Object.assign({}, book), { quantity: 1 }));
    }
    updateCart();
}
function removeFromCart(title) {
    cart = cart.filter((item) => item.title !== title);
    updateCart();
}
function changeQuantity(title, change) {
    const item = cart.find((item) => item.title === title);
    if (item) {
        if (change === -1 && item.quantity > 1) {
            item.quantity--;
        }
        else if (change === 1) {
            item.quantity++;
        }
    }
    updateCart();
}
function updateCart() {
    cartContainer.innerHTML = "";
    countElement.innerText = cart.length.toString();
    let totalCartCost = 0;
    cart.forEach((item) => {
        var _a, _b, _c;
        const itemTotalCost = item.cost * item.quantity;
        totalCartCost += itemTotalCost;
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-details">
            <h4>${item.title}</h4>
            <p>Price: $${item.cost.toFixed(2)}</p>
            <div class="quantity-control">
                <button class="qty-btn decrease">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn increase">+</button>
            </div>
            <p><strong>Total: $${itemTotalCost.toFixed(2)}</strong></p>
        </div>
        <button class="remove-btn">Remove</button>
        <hr>
    `;
        cartContainer.appendChild(cartItem);
        (_a = cartItem
            .querySelector(".remove-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => removeFromCart(item.title));
        (_b = cartItem
            .querySelector(".decrease")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => changeQuantity(item.title, -1));
        (_c = cartItem
            .querySelector(".increase")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => changeQuantity(item.title, 1));
    });
    const totalCostElement = document.createElement("div");
    totalCostElement.classList.add("cart-total");
    totalCostElement.innerHTML = `<h3>Total Cost: $${totalCartCost.toFixed(2)}</h3>`;
    cartContainer.appendChild(totalCostElement);
}
