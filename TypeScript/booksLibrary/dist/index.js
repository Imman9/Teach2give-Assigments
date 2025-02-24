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
const api = "http://localhost:3000/Books";
let cart = [];
function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(api);
            const data = yield res.json();
            return data;
        }
        catch (err) {
            console.error("Error fetching data: ", err);
        }
    });
}
function displayAllBooks(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const booksContainer = document.getElementById("booksContainer");
        booksContainer.innerHTML = "";
        if (!data) {
            document.getElementById("errorMsg").style.display =
                "block";
            return;
        }
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
function filteredBooks(genre) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fetchData();
        if (!data)
            return;
        const filteredData = data.filter((d) => d.genre === genre);
        displayAllBooks(filteredData);
    });
}
function sortBooksBy(property_1) {
    return __awaiter(this, arguments, void 0, function* (property, order = "asc") {
        const data = yield fetchData();
        if (!data)
            return;
        data.sort((a, b) => {
            const valA = Number(a[property]);
            const valB = Number(b[property]);
            return order === "asc" ? valA - valB : valB - valA;
        });
        displayAllBooks(data);
    });
}
function initial() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const data = yield fetchData();
        displayAllBooks(data);
        (_a = document
            .getElementById("searchInput")) === null || _a === void 0 ? void 0 : _a.addEventListener("input", searchBooks);
        (_b = document
            .getElementById("genreFilter")) === null || _b === void 0 ? void 0 : _b.addEventListener("change", (event) => __awaiter(this, void 0, void 0, function* () {
            const selectedGenre = event.target.value;
            selectedGenre ? filteredBooks(selectedGenre) : displayAllBooks(data);
        }));
    });
}
initial();
const cartCard = document.getElementById("cart");
const cartToggle = document.getElementById("toggleCartBtn");
cartToggle.addEventListener("click", () => {
    cartCard.style.display =
        cartCard.style.display === "block" ? "none" : "block";
});
const cartContainer = document.querySelector(".cart-items");
const countElement = document.getElementById("count");
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
        item.quantity = Math.max(1, item.quantity + change);
    }
    updateCart();
}
function updateCart() {
    cartContainer.innerHTML = "";
    countElement.innerText = cart.length.toString();
    let totalCartCost = 0;
    cart.forEach((item) => {
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
                <button class="qty-btn decrease" onclick="changeQuantity('${item.title}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn increase" onclick="changeQuantity('${item.title}', 1)">+</button>
            </div>
            <p><strong>Total: $${itemTotalCost.toFixed(2)}</strong></p>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${item.title}')">Remove</button>
        <hr>
    `;
        cartContainer.appendChild(cartItem);
    });
    const totalCostElement = document.createElement("div");
    totalCostElement.classList.add("cart-total");
    totalCostElement.innerHTML = `<h3>Total Cost: $${totalCartCost.toFixed(2)}</h3>`;
    cartContainer.appendChild(totalCostElement);
}
function searchBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = document.getElementById("searchInput").value.toLowerCase();
        const data = yield fetchData();
        if (!data)
            return;
        const filteredData = data.filter((book) => book.title.toLowerCase().includes(query));
        if (filteredData.length === 0) {
            document.getElementById("errorMsg").style.display =
                "block";
            document.getElementById("booksContainer").innerHTML = "";
        }
        else {
            document.getElementById("errorMsg").style.display = "none";
            displayAllBooks(filteredData);
        }
    });
}
//# sourceMappingURL=index.js.map