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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
const api = "http://localhost:3000";
let cart = [];
const cartContainer = document.querySelector(".cart-items");
const countElement = document.getElementById("count");
// Redirect to Auth Page
(_a = document.getElementById("authBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    window.location.href = "auth.html";
});
// Check if User is Logged In
function isLoggedIn() {
    return localStorage.getItem("token") !== null;
}
// Fetch Data with Token
function fetchData() {
    return __awaiter(this, arguments, void 0, function* (params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const res = yield fetch(`${api}/api/books?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.status === 401) {
                alert("Session expired. Please log in again.");
                localStorage.removeItem("token"); // Clear the expired token
                window.location.href = "auth.html"; // Redirect to login page
                return null;
            }
            const data = yield res.json();
            return data.map((book) => (Object.assign(Object.assign({}, book), { cost: Number(book.cost) })));
        }
        catch (err) {
            console.error("Error fetching data: ", err);
            return null;
        }
    });
}
// Display Books
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
        ${(isLoggedIn() && localStorage.getItem("role") === "1") || "2"
                ? `
          <div class="admin-actions">
            <i class="fa fa-edit edit-btn" data-id="${book.book_id}"></i>
            <i class="fa fa-trash delete-btn" data-id="${book.book_id}"></i>
          </div>
        `
                : ""}
    `;
            booksContainer.appendChild(card);
            const buyBtn = card.querySelector(".shop-now");
            buyBtn.addEventListener("click", () => {
                if (!isLoggedIn()) {
                    alert("Please log in to borrow books.");
                    window.location.href = "auth.html";
                }
                else {
                    addToCart(book);
                }
            });
            if ((isLoggedIn() && localStorage.getItem("role") === "1") || "2") {
                const editBtn = card.querySelector(".edit-btn");
                const deleteBtn = card.querySelector(".delete-btn");
                editBtn.addEventListener("click", (event) => {
                    event.preventDefault(); // Prevent default behavior
                    event.stopPropagation(); // Stop event propagation
                    const bookId = editBtn.getAttribute("data-id");
                    if (bookId) {
                        // Fetch the book details by ID
                        fetch(`${api}/api/books/${bookId}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        })
                            .then((response) => response.json())
                            .then((book) => {
                            // Populate the form with the book's data
                            document.getElementById("bookId").value =
                                book.book_id.toString();
                            document.getElementById("title").value =
                                book.title;
                            document.getElementById("author").value =
                                book.author;
                            document.getElementById("genre").value =
                                book.genre;
                            document.getElementById("year").value =
                                book.year.toString();
                            document.getElementById("pages").value =
                                book.pages.toString();
                            document.getElementById("publisher").value =
                                book.publisher;
                            document.getElementById("description").value = book.description;
                            document.getElementById("image").value =
                                book.image;
                            document.getElementById("cost").value =
                                book.cost.toString();
                            // Change the form title and submit button text
                            const formTitle = document.querySelector("#createBookForm h2");
                            formTitle.textContent = "Edit Book";
                            const submitBtn = document.getElementById("submitBtn");
                            submitBtn.textContent = "Save Changes";
                            // Show the form
                            const createBookForm = document.getElementById("createBookForm");
                            createBookForm.style.display = "block";
                        })
                            .catch((err) => {
                            console.error("Error fetching book details:", err);
                            alert("Failed to fetch book details");
                        });
                    }
                });
                deleteBtn.addEventListener("click", (event) => __awaiter(this, void 0, void 0, function* () {
                    event.preventDefault(); // Prevent default behavior
                    event.stopPropagation(); // Stop event propagation
                    const bookId = deleteBtn.getAttribute("data-id");
                    if (confirm("Are you sure you want to delete this book?")) {
                        yield fetch(`${api}/api/books/${bookId}`, {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        });
                        initial(); // Refresh the book list
                    }
                }));
            }
        });
    });
}
// Admin: Create Book Form
(_b = document.getElementById("createBookBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    const createBookForm = document.getElementById("createBookForm");
    createBookForm.style.display = "block";
});
(_c = document
    .getElementById("createBookForm")) === null || _c === void 0 ? void 0 : _c.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const bookId = document.getElementById("bookId")
        .value;
    const title = document.getElementById("title").value;
    const author = document.getElementById("author")
        .value;
    const genre = document.getElementById("genre").value;
    const year = document.getElementById("year").value;
    const pages = document.getElementById("pages").value;
    const publisher = document.getElementById("publisher")
        .value;
    const description = document.getElementById("description").value;
    const image = document.getElementById("image").value;
    const cost = parseFloat(document.getElementById("cost").value);
    const total_copies = document.getElementById("total_copies").value;
    const url = bookId ? `${api}/api/books/${bookId}` : `${api}/api/books`;
    const method = bookId ? "PATCH" : "POST";
    try {
        const response = yield fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                title,
                author,
                genre,
                year,
                pages,
                publisher,
                description,
                image,
                cost,
                total_copies,
            }),
        });
        if (response.ok) {
            alert(bookId ? "Book updated successfully" : "Book created successfully");
            initial(); // Refresh the book list
            resetForm(); // Reset and hide the form
        }
        else {
            alert(bookId ? "Failed to update book" : "Failed to create book");
        }
    }
    catch (err) {
        console.error("Error:", err);
        alert("Server error");
    }
}));
function resetForm() {
    const createBookForm = document.getElementById("createBookForm");
    createBookForm.reset();
    createBookForm.style.display = "none";
    document.getElementById("bookId").value = ""; // Clear the bookId
}
// Borrower: Borrow Book Form
(_d = document.getElementById("borrowBookBtn")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
    const borrowBookForm = document.getElementById("borrowBookForm");
    borrowBookForm.style.display = "block";
});
const borrowMessage = document.getElementById("borrowMessage");
(_e = document
    .getElementById("borrowBookFormElement")) === null || _e === void 0 ? void 0 : _e.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    // Log the form data
    const user_id = document.getElementById("user_id")
        .value;
    const copy_id = document.getElementById("copy_id")
        .value;
    const librarian_id = document.getElementById("librarian_id").value;
    const return_date = document.getElementById("return_date").value;
    const status = document.getElementById("status")
        .value;
    if (!copy_id || !librarian_id || !return_date || !status) {
        alert("Please fill in all fields.");
        return;
    }
    if (new Date(return_date) < new Date()) {
        alert("Return date must be in the future.");
        return;
    }
    try {
        const response = yield fetch(`${api}/api/borrow`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                user_id,
                copy_id,
                librarian_id,
                return_date,
                status,
            }),
        });
        // Log the response
        console.log("Response:", response);
        if (!response.ok) {
            const errorData = yield response.json();
            console.error("Error Data:", errorData);
            throw new Error(errorData.message || "Failed to borrow book");
        }
        const result = yield response.json();
        console.log("Success:", result);
        alert("Book borrowed successfully");
        initial(); // Refresh the book list
        resetBorrowForm(); // Reset and hide the form
        borrowMessage.textContent = "Book borrowed successfully!";
        borrowMessage.classList.remove("error");
        borrowMessage.classList.add("success");
    }
    catch (err) {
        console.error("Error:", err);
        alert(err.message || "Server error");
    }
}));
// Function to reset the borrow form
function resetBorrowForm() {
    const borrowBookForm = document.getElementById("borrowBookFormElement");
    borrowBookForm.reset();
    const borrowBookFormContainer = document.getElementById("borrowBookForm");
    borrowBookFormContainer.style.display = "none";
}
// Close the borrow form
(_f = document.getElementById("closeBorrowForm")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", () => {
    resetBorrowForm();
});
(_g = document
    .getElementById("viewBorrowingRecordsBtn")) === null || _g === void 0 ? void 0 : _g.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${api}/api/borrow`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch borrowing records");
        }
        const borrowingRecords = yield response.json();
        console.log("Borrowing Records:", borrowingRecords);
        // Display the records in the UI (e.g., in a table or list)
        const recordsContainer = document.createElement("div");
        recordsContainer.innerHTML = `
      <h3>Borrowing Records</h3>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Book</th>
            <th>Borrow Date</th>
            <th>Return Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${borrowingRecords
            .map((record) => `
            <tr>
              <td>${record.username}</td>
              <td>${record.title}</td>
              <td>${new Date(record.borrow_date).toLocaleDateString()}</td>
              <td>${new Date(record.return_date).toLocaleDateString()}</td>
              <td>${record.status}</td>
            </tr>
          `)
            .join("")}
        </tbody>
      </table>
    `;
        document.body.appendChild(recordsContainer);
    }
    catch (err) {
        console.error("Error fetching borrowing records:", err);
        alert("Failed to fetch borrowing records");
    }
}));
(_h = document
    .getElementById("viewBorrowingRecordsBtn")) === null || _h === void 0 ? void 0 : _h.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${api}/api/borrowers`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch borrowing records");
        }
        const borrowingRecords = yield response.json();
        console.log("Borrowing Records:", borrowingRecords);
        // Display the records in the UI (e.g., in a table or list)
        const recordsContainer = document.createElement("div");
        recordsContainer.innerHTML = `
      <h3>Borrowing Records</h3>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Book</th>
            <th>Borrow Date</th>
            <th>Return Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${borrowingRecords
            .map((record) => `
            <tr>
              <td>${record.username}</td>
              <td>${record.title}</td>
              <td>${new Date(record.borrow_date).toLocaleDateString()}</td>
              <td>${new Date(record.return_date).toLocaleDateString()}</td>
              <td>${record.status}</td>
            </tr>
          `)
            .join("")}
        </tbody>
      </table>
    `;
        document.body.appendChild(recordsContainer);
    }
    catch (err) {
        console.error("Error fetching borrowing records:", err);
        alert("Failed to fetch borrowing records");
    }
}));
// Filters and sorting
(_j = document
    .getElementById("genreFilter")) === null || _j === void 0 ? void 0 : _j.addEventListener("change", (event) => __awaiter(void 0, void 0, void 0, function* () {
    const selectedGenre = event.target.value;
    const data = yield fetchData(selectedGenre ? { genre: selectedGenre } : {});
    displayAllBooks(data);
}));
(_k = document.getElementById("searchInput")) === null || _k === void 0 ? void 0 : _k.addEventListener("input", () => __awaiter(void 0, void 0, void 0, function* () {
    const query = document.getElementById("searchInput").value.trim();
    const data = yield fetchData(query ? { title: query } : {});
    displayAllBooks(data);
}));
(_l = document.getElementById("sortAsc")) === null || _l === void 0 ? void 0 : _l.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetchData({ sort: "asc" });
    displayAllBooks(data);
}));
(_m = document.getElementById("sortDesc")) === null || _m === void 0 ? void 0 : _m.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetchData({ sort: "desc" });
    displayAllBooks(data);
}));
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
(_o = document.getElementById("logoutBtn")) === null || _o === void 0 ? void 0 : _o.addEventListener("click", () => {
    logout();
});
function customizeUI() {
    const role = localStorage.getItem("role");
    const adminFeatures = document.getElementById("adminFeatures");
    const librarianFeatures = document.getElementById("librarianFeatures");
    const borrowerFeatures = document.getElementById("borrowerFeatures");
    // Hide all role-specific sections initially
    adminFeatures.style.display = "none";
    librarianFeatures.style.display = "none";
    borrowerFeatures.style.display = "none";
    // Show the appropriate section based on the user's role
    if (role === "1") {
        adminFeatures.style.display = "block"; // Show admin features
    }
    else if (role === "2") {
        librarianFeatures.style.display = "block"; // Show librarian features
    }
    else if (role === "3") {
        borrowerFeatures.style.display = "block"; // Show borrower features
    }
}
// Admin: Create Book
(_p = document.getElementById("createBookBtn")) === null || _p === void 0 ? void 0 : _p.addEventListener("click", () => {
    const createBookForm = document.getElementById("createBookForm");
    createBookForm.style.display = "block";
});
(_q = document.getElementById("closeCreateForm")) === null || _q === void 0 ? void 0 : _q.addEventListener("click", () => {
    const createBookForm = document.getElementById("createBookForm");
    createBookForm.style.display = "none";
});
// Admin: Delete User
(_r = document.getElementById("deleteUserBtn")) === null || _r === void 0 ? void 0 : _r.addEventListener("click", () => {
    const userId = prompt("Enter the user ID to delete:");
    if (userId) {
        fetch(`${api}/api/users/${userId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
            if (response.ok) {
                alert("User deleted successfully");
            }
            else {
                alert("Failed to delete user");
            }
        })
            .catch((err) => {
            console.error("Error deleting user:", err);
            alert("Server error");
        });
    }
});
// Librarian: Delete Book
(_s = document.getElementById("deleteBookBtn")) === null || _s === void 0 ? void 0 : _s.addEventListener("click", () => {
    const bookId = prompt("Enter the book ID to delete:");
    if (bookId) {
        fetch(`${api}/api/books/${bookId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
            if (response.ok) {
                alert("Book deleted successfully");
            }
            else {
                alert("Failed to delete book");
            }
        })
            .catch((err) => {
            console.error("Error deleting book:", err);
            alert("Server error");
        });
    }
});
// Borrower: Borrow Book
// document.getElementById("borrowBookBtn")?.addEventListener("click", () => {
//   if (!isLoggedIn()) {
//     alert("Please log in to borrow books.");
//     window.location.href = "auth.html";
//     return;
//   }
//   const bookId = prompt("Enter the book ID to borrow:");
//   if (bookId && !isNaN(Number(bookId))) {
//     const borrowBookBtn = document.getElementById(
//       "borrowBookBtn"
//     ) as HTMLButtonElement;
//     borrowBookBtn.disabled = true; // Disable the button
//     borrowBookBtn.textContent = "Borrowing..."; // Update button text
//     fetch(`${api}/api/borrow`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify({
//         book_id: bookId,
//         user_id: localStorage.getItem("user_id"),
//       }),
//     })
//       .then((response) => {
//         if (response.ok) {
//           alert("Book borrowed successfully");
//         } else {
//           response.json().then((data) => {
//             alert(data.error || "Failed to borrow book");
//           });
//         }
//       })
//       .catch((err) => {
//         console.error("Error borrowing book:", err);
//         alert("Server error");
//       });
//   } else {
//     alert("Invalid book ID. Please enter a valid number.");
//   }
// });
document.addEventListener("DOMContentLoaded", () => {
    customizeUI(); // Customize the UI based on the user's role
    initial(); // Fetch and display books
});
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    fetch(`${api}/api/auth/logout`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
        .then((response) => {
        if (response.ok) {
            console.log("Logged out successfully");
        }
        else {
            console.error("Logout failed");
        }
    })
        .catch((err) => {
        console.error("Error during logout:", err);
    });
    window.location.href = "auth.html";
}
// Initial data fetch
function initial() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fetchData();
        displayAllBooks(data);
    });
}
