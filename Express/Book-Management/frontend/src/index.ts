const api: string = "http://localhost:3000";

interface Book {
  book_id: number;
  title: string;
  author: string;
  genre: string;
  year: number;
  pages: number;
  cost: number;
  image: string;
}

interface BookCopy {
  copy_id: number;
  book_id: number;
  status: string;
}

interface CartItem extends Book {
  quantity: number;
}

let cart: CartItem[] = [];
const cartContainer = document.querySelector(".cart-items") as HTMLDivElement;
const countElement = document.getElementById("count") as HTMLElement;

// Redirect to Auth Page
document.getElementById("authBtn")?.addEventListener("click", () => {
  window.location.href = "index.html";
});

// Check if User is Logged In
function isLoggedIn(): boolean {
  return localStorage.getItem("token") !== null;
}

// Fetch Data with Token
async function fetchData(
  params: Record<string, string | number> = {}
): Promise<Book[] | null> {
  try {
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    const res = await fetch(`${api}/api/books?${queryString}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.status === 401) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token"); // Clear the expired token
      window.location.href = "index.html"; // Redirect to login page
      return null;
    }

    const data: Book[] = await res.json();
    return data.map((book) => ({
      ...book,
      cost: Number(book.cost), // Ensure it's a number
    }));
  } catch (err) {
    console.error("Error fetching data: ", err);
    return null;
  }
}

// Display Books
async function displayAllBooks(data: Book[] | null): Promise<void> {
  const booksContainer = document.getElementById(
    "booksContainer"
  ) as HTMLDivElement;
  booksContainer.innerHTML = "";

  if (!data || data.length === 0) {
    document.getElementById("errorMsg")!.style.display = "block";
    return;
  }

  document.getElementById("errorMsg")!.style.display = "none";

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
        <button class="shop-now">Buy Now <h2><strong>$${
          book.cost
        }</strong></h2></button>
        ${
          (isLoggedIn() && localStorage.getItem("role") === "1") || "2"
            ? `
          <div class="admin-actions">
            <i class="fa fa-edit edit-btn" data-id="${book.book_id}"></i>
            <i class="fa fa-trash delete-btn" data-id="${book.book_id}"></i>
          </div>
        `
            : ""
        }
    `;
    booksContainer.appendChild(card);

    const buyBtn = card.querySelector(".shop-now") as HTMLButtonElement;
    buyBtn.addEventListener("click", () => {
      if (!isLoggedIn()) {
        alert("Please log in to borrow books.");
        window.location.href = "index.html";
      } else {
        addToCart(book);
      }
    });

    if ((isLoggedIn() && localStorage.getItem("role") === "1") || "2") {
      const editBtn = card.querySelector(".edit-btn") as HTMLElement;
      const deleteBtn = card.querySelector(".delete-btn") as HTMLElement;

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
              (document.getElementById("bookId") as HTMLInputElement).value =
                book.book_id.toString();
              (document.getElementById("title") as HTMLInputElement).value =
                book.title;
              (document.getElementById("author") as HTMLInputElement).value =
                book.author;
              (document.getElementById("genre") as HTMLInputElement).value =
                book.genre;
              (document.getElementById("year") as HTMLInputElement).value =
                book.year.toString();
              (document.getElementById("pages") as HTMLInputElement).value =
                book.pages.toString();
              (document.getElementById("publisher") as HTMLInputElement).value =
                book.publisher;
              (
                document.getElementById("description") as HTMLTextAreaElement
              ).value = book.description;
              (document.getElementById("image") as HTMLInputElement).value =
                book.image;
              (document.getElementById("cost") as HTMLInputElement).value =
                book.cost.toString();

              // Change the form title and submit button text
              const formTitle = document.querySelector(
                "#createBookForm h2"
              ) as HTMLElement;
              formTitle.textContent = "Edit Book";

              const submitBtn = document.getElementById(
                "submitBtn"
              ) as HTMLButtonElement;
              submitBtn.textContent = "Save Changes";

              // Show the form
              const createBookForm = document.getElementById(
                "createBookForm"
              ) as HTMLDivElement;
              createBookForm.style.display = "block";
            })
            .catch((err) => {
              console.error("Error fetching book details:", err);
              alert("Failed to fetch book details");
            });
        }
      });

      deleteBtn.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent default behavior
        event.stopPropagation(); // Stop event propagation

        const bookId = deleteBtn.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this book?")) {
          await fetch(`${api}/api/books/${bookId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          initial(); // Refresh the book list
        }
      });
    }
  });
}

// Admin: Create Book Form
document.getElementById("createBookBtn")?.addEventListener("click", () => {
  const createBookForm = document.getElementById(
    "createBookForm"
  ) as HTMLDivElement;
  createBookForm.style.display = "block";
});

document
  .getElementById("createBookForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const bookId = (document.getElementById("bookId") as HTMLInputElement)
      .value;
    const title = (document.getElementById("title") as HTMLInputElement).value;
    const author = (document.getElementById("author") as HTMLInputElement)
      .value;
    const genre = (document.getElementById("genre") as HTMLInputElement).value;
    const year = (document.getElementById("year") as HTMLInputElement).value;
    const pages = (document.getElementById("pages") as HTMLInputElement).value;
    const publisher = (document.getElementById("publisher") as HTMLInputElement)
      .value;
    const description = (
      document.getElementById("description") as HTMLTextAreaElement
    ).value;
    const image = (document.getElementById("image") as HTMLInputElement).value;
    const cost = parseFloat(
      (document.getElementById("cost") as HTMLInputElement).value
    );
    const total_copies = (
      document.getElementById("total_copies") as HTMLInputElement
    ).value;

    const url = bookId ? `${api}/api/books/${bookId}` : `${api}/api/books`;
    const method = bookId ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
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
        alert(
          bookId ? "Book updated successfully" : "Book created successfully"
        );
        initial(); // Refresh the book list
        resetForm(); // Reset and hide the form
      } else {
        alert(bookId ? "Failed to update book" : "Failed to create book");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    }
  });

function resetForm(): void {
  const createBookForm = document.getElementById(
    "createBookForm"
  ) as HTMLFormElement;
  createBookForm.reset();
  createBookForm.style.display = "none";
  (document.getElementById("bookId") as HTMLInputElement).value = ""; // Clear the bookId
}
document.getElementById("borrowBookBtn")?.addEventListener("click", () => {
  const borrowBookForm = document.getElementById(
    "borrowBookForm"
  ) as HTMLDivElement;
  borrowBookForm.style.display = "block";
});

document
  .getElementById("borrowBookFormElement")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user_id = localStorage.getItem("userId");
    if (!user_id) {
      alert("Please log in to borrow books.");
      return;
    }

    const copy_id = (document.getElementById("copy_id") as HTMLInputElement)
      .value;
    const librarian_id = (
      document.getElementById("librarian_id") as HTMLInputElement
    ).value;
    const return_date = (
      document.getElementById("return_date") as HTMLInputElement
    ).value;

    try {
      const response = await fetch(`${api}/api/borrow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ user_id, copy_id, librarian_id, return_date }),
      });

      if (!response.ok) {
        throw new Error("Failed to send borrow request.");
      }

      alert("Borrow request sent!");
      resetBorrowForm();
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    }
  });

// Borrower: Borrow Book Form
// document.getElementById("borrowBookBtn")?.addEventListener("click", () => {
//   const borrowBookForm = document.getElementById(
//     "borrowBookForm"
//   ) as HTMLDivElement;
//   borrowBookForm.style.display = "block";
// });

// const borrowMessage = document.getElementById(
//   "borrowMessage"
// ) as HTMLParagraphElement;
// document
//   .getElementById("borrowBookFormElement")
//   ?.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const user_id = localStorage.getItem("userId"); // Get user_id from localStorage
//     console.log("User ID from localStorage:", user_id);
//     if (!user_id) {
//       alert("You must be logged in to borrow books.");
//       return;
//     }

//     // Log the form data

//     const copy_id = (document.getElementById("copy_id") as HTMLInputElement)
//       .value;
//     const librarian_id = (
//       document.getElementById("librarian_id") as HTMLInputElement
//     ).value;
//     const return_date = (
//       document.getElementById("return_date") as HTMLInputElement
//     ).value;

//     if (!copy_id || !librarian_id || !return_date) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     if (new Date(return_date) < new Date()) {
//       alert("Return date must be in the future.");
//       return;
//     }

//     try {
//       const response = await fetch(`${api}/api/borrow`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           user_id,
//           copy_id,
//           librarian_id,
//           return_date,
//           status: "Borrowed",
//         }),
//       });

//       // Log the response
//       console.log("Response:", response);

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Error Data:", errorData);
//         throw new Error(errorData.message || "Failed to borrow book");
//       }

//       const result = await response.json();
//       console.log("Success:", result);

//       alert("Book borrowed successfully");
//       initial(); // Refresh the book list
//       resetBorrowForm(); // Reset and hide the form
//       borrowMessage.textContent = "Book borrowed successfully!";
//       borrowMessage.classList.remove("error");
//       borrowMessage.classList.add("success");
//     } catch (err: any) {
//       console.error("Error:", err);
//       alert(err.message || "Server error");
//     }
//   });

// Function to reset the borrow form
function resetBorrowForm(): void {
  const borrowBookForm = document.getElementById(
    "borrowBookFormElement"
  ) as HTMLFormElement;
  borrowBookForm.reset();
  const borrowBookFormContainer = document.getElementById(
    "borrowBookForm"
  ) as HTMLDivElement;
  borrowBookFormContainer.style.display = "none";
}

// Close the borrow form
document.getElementById("closeBorrowForm")?.addEventListener("click", () => {
  resetBorrowForm();
});

document
  .getElementById("viewBorrowingRecordsBtn")
  ?.addEventListener("click", async () => {
    try {
      const response = await fetch(`${api}/api/borrow`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch borrowing records");
      }

      const borrowingRecords = await response.json();
      console.log("Borrowing Records:", borrowingRecords);

      // Create borrowing records table
      const recordsContainer = document.getElementById(
        "borrowingRecords"
      ) as HTMLDivElement;
      recordsContainer.innerHTML = `
        <h3>Borrowing Records</h3>
        <table>
          <thead>
            <tr>
              <th>Borrower</th>
              <th>Librarian</th>
              <th>Book</th>
              <th>Borrow Date</th>
              <th>Return Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${borrowingRecords
              .map(
                (record: any) => `
              <tr>
                <td>${record.borrower_name}</td>
                <td>${record.librarian_name || "N/A"}</td>
                <td>${record.title}</td>
                <td>${new Date(record.borrow_date).toLocaleDateString()}</td>
                <td>${
                  record.return_date
                    ? new Date(record.return_date).toLocaleDateString()
                    : "Not Returned"
                }</td>
                <td>${record.status}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;

      // Show the modal
      const modal = document.getElementById(
        "borrowingRecordsModal"
      ) as HTMLDivElement;
      modal.style.display = "block";
    } catch (err) {
      console.error("Error fetching borrowing records:", err);
    }
  });

// Close modal when clicking the close button
document.getElementById("closeRecordsModal")?.addEventListener("click", () => {
  const modal = document.getElementById(
    "borrowingRecordsModal"
  ) as HTMLDivElement;
  modal.style.display = "none";
});

document
  .getElementById("viewBorrowedBooksBtn")
  ?.addEventListener("click", async () => {
    try {
      const user_id = localStorage.getItem("userId");
      if (!user_id) {
        alert("You must be logged in to view borrowed books.");
        return;
      }

      const response = await fetch(`${api}/api/borrow/user/${user_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch borrowed books");
      }

      const borrowedBooks = await response.json();
      console.log("Borrowed Books:", borrowedBooks);

      // Create Borrowed Books Table
      const borrowedContainer = document.getElementById(
        "borrowedBooks"
      ) as HTMLDivElement;
      borrowedContainer.innerHTML = `
        <h3>Your Borrowed Books</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Copy ID</th>
              <th>Borrow Date</th>
              <th>Return Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${borrowedBooks
              .map(
                (record: any) => `
              <tr>
                <td>${record.title}</td>
                <td>${record.copy_id}</td>
                <td>${new Date(record.borrow_date).toLocaleDateString()}</td>
                <td>${
                  record.return_date
                    ? new Date(record.return_date).toLocaleDateString()
                    : "Not Returned"
                }</td>
                <td>${record.status}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;

      // Show Borrowed Books Modal
      const modal = document.getElementById(
        "borrowedBooksModal"
      ) as HTMLDivElement;
      modal.style.display = "block";
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
      alert("Failed to fetch borrowed books");
    }
  });

// Close modal when clicking the close button
document
  .getElementById("closeBorrowedBooksModal")
  ?.addEventListener("click", () => {
    const modal = document.getElementById(
      "borrowedBooksModal"
    ) as HTMLDivElement;
    modal.style.display = "none";
  });

document
  .getElementById("returnBookBtn")
  ?.addEventListener("click", async () => {
    try {
      const copyId = prompt(
        "Enter the Copy ID of the book you want to return:"
      );
      if (!copyId || isNaN(Number(copyId))) {
        alert("Please enter a valid Copy ID.");
        return;
      }

      const response = await fetch(`${api}/api/borrow/return/${copyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "Returned" }),
      });

      if (!response.ok) {
        throw new Error("Failed to return book");
      }

      alert("Book returned successfully!");
      location.reload(); // Refresh to update UI
    } catch (err) {
      console.error("Error returning book:", err);
      alert("Failed to return book");
    }
  });
//approve borrow
document
  .getElementById("approveBorrowBtn")
  ?.addEventListener("click", async () => {
    try {
      const response = await fetch(`${api}/api/borrow/pending`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch borrow requests");
      }

      const pendingRequests = await response.json();
      console.log("Pending Requests:", pendingRequests);

      const requestsContainer = document.getElementById(
        "approveBorrowRequests"
      ) as HTMLDivElement;
      requestsContainer.innerHTML = `
      <h3>Pending Borrow Requests</h3>
      <table>
        <thead>
          <tr><th>Borrower</th><th>Book</th><th>Request Date</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${pendingRequests
            .map(
              (request: any) => `
            <tr>
              <td>${request.borrower_name}</td>
              <td>${request.title}</td>
              <td>${new Date(request.borrow_date).toLocaleDateString()}</td>
              <td>
                <button class="approve-btn" data-id="${
                  request.borrower_id
                }">Approve</button>
                <button class="reject-btn" data-id="${
                  request.borrower_id
                }">Reject</button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
    } catch (err) {
      console.error("Error fetching borrow requests:", err);
    }
  });

// Close modal
document
  .getElementById("closeApproveBorrowModal")
  ?.addEventListener("click", () => {
    const modal = document.getElementById(
      "approveBorrowModal"
    ) as HTMLDivElement;
    modal.style.display = "none";
  });
//process returns
document
  .getElementById("processReturnsBtn")
  ?.addEventListener("click", async () => {
    try {
      const response = await fetch(`${api}/api/borrow/borrowed`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch borrowed books");
      }

      const borrowedBooks = await response.json();
      console.log("Borrowed Books:", borrowedBooks);

      const returnContainer = document.getElementById(
        "processReturns"
      ) as HTMLDivElement;
      returnContainer.innerHTML = `
      <h3>Borrowed Books</h3>
      <table>
        <thead>
          <tr>
            <th>Borrower</th>
            <th>Book</th>
            <th>Copy ID</th>
            <th>Borrow Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${borrowedBooks
            .map(
              (book: any) => `
            <tr>
              <td>${book.borrower_name}</td>
              <td>${book.title}</td>
              <td>${book.copy_id}</td>
              <td>${new Date(book.borrow_date).toLocaleDateString()}</td>
              <td>
                <button class="return-btn" data-id="${
                  book.copy_id
                }">Return</button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

      // Show modal
      const modal = document.getElementById(
        "processReturnsModal"
      ) as HTMLDivElement;
      modal.style.display = "block";

      // Attach event listeners to return buttons
      document.querySelectorAll(".return-btn").forEach((btn) => {
        btn.addEventListener("click", async (event) => {
          const copyId = (event.target as HTMLElement).getAttribute("data-id");
          if (!copyId) return;

          await fetch(`${api}/api/borrowers/return/${copyId}`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          alert("Book returned successfully!");
          location.reload();
        });
      });
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
      alert("Failed to fetch borrowed books.");
    }
  });

// Close modal
document
  .getElementById("closeProcessReturnsModal")
  ?.addEventListener("click", () => {
    const modal = document.getElementById(
      "processReturnsModal"
    ) as HTMLDivElement;
    modal.style.display = "none";
  });
// manage book copies
document
  .getElementById("manageBookCopiesBtn")
  ?.addEventListener("click", async () => {
    window.location.href = "manage_book_copies.html";
  });

//librarian view borrowers list
document
  .getElementById("viewBorrowersListBtn")
  ?.addEventListener("click", async () => {
    try {
      const response = await fetch(`${api}/api/borrow`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch borrowers list");
      }

      const borrowers = await response.json();
      console.log("Borrowers List:", borrowers);

      const borrowersContainer = document.getElementById(
        "borrowersList"
      ) as HTMLDivElement;
      borrowersContainer.innerHTML = `
      <h3>Borrowers List</h3>
      <table>
        <thead>
          <tr>
            <th>Borrower</th>
            <th>Book</th>
            <th>Copy ID</th>
            <th>Borrow Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${borrowers
            .map(
              (borrower: any) => `
            <tr>
              <td>${borrower.borrower_name}</td>
              <td>${borrower.title}</td>
              <td>${borrower.copy_id}</td>
              <td>${new Date(borrower.borrow_date).toLocaleDateString()}</td>
              <td>${borrower.status}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

      // Show modal
      const modal = document.getElementById(
        "borrowersListModal"
      ) as HTMLDivElement;
      modal.style.display = "block";
    } catch (err) {
      console.error("Error fetching borrowers list:", err);
      alert("Failed to fetch borrowers list.");
    }
  });

// Close modal
document
  .getElementById("closeBorrowersListModal")
  ?.addEventListener("click", () => {
    const modal = document.getElementById(
      "borrowersListModal"
    ) as HTMLDivElement;
    modal.style.display = "none";
  });

// Filters and sorting
document
  .getElementById("genreFilter")
  ?.addEventListener("change", async (event) => {
    const selectedGenre = (event.target as HTMLSelectElement).value;
    const data = await fetchData(selectedGenre ? { genre: selectedGenre } : {});
    displayAllBooks(data);
  });

document.getElementById("searchInput")?.addEventListener("input", async () => {
  const query = (
    document.getElementById("searchInput") as HTMLInputElement
  ).value.trim();
  const data = await fetchData(query ? { title: query } : {});
  displayAllBooks(data);
});

document.getElementById("sortAsc")?.addEventListener("click", async () => {
  const data = await fetchData({ sort: "asc" });
  displayAllBooks(data);
});

document.getElementById("sortDesc")?.addEventListener("click", async () => {
  const data = await fetchData({ sort: "desc" });
  displayAllBooks(data);
});

// Cart Functions
const cartCard = document.getElementById("cart") as HTMLDivElement;
const cartToggle = document.getElementById(
  "toggleCartBtn"
) as HTMLButtonElement;

cartToggle.addEventListener("click", function () {
  cartCard.style.display =
    cartCard.style.display === "block" ? "none" : "block";
});

function addToCart(book: Book): void {
  const existingItem = cart.find((item) => item.title === book.title);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...book, quantity: 1 });
  }
  updateCart();
}

function removeFromCart(title: string): void {
  cart = cart.filter((item) => item.title !== title);
  updateCart();
}

function changeQuantity(title: string, change: number): void {
  const item = cart.find((item) => item.title === title);
  if (item) {
    if (change === -1 && item.quantity > 1) {
      item.quantity--;
    } else if (change === 1) {
      item.quantity++;
    }
  }
  updateCart();
}

function updateCart(): void {
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

    cartItem
      .querySelector(".remove-btn")
      ?.addEventListener("click", () => removeFromCart(item.title));
    cartItem
      .querySelector(".decrease")
      ?.addEventListener("click", () => changeQuantity(item.title, -1));
    cartItem
      .querySelector(".increase")
      ?.addEventListener("click", () => changeQuantity(item.title, 1));
  });

  const totalCostElement = document.createElement("div");
  totalCostElement.classList.add("cart-total");
  totalCostElement.innerHTML = `<h3>Total Cost: $${totalCartCost.toFixed(
    2
  )}</h3>`;
  cartContainer.appendChild(totalCostElement);
}
function saveCart(): void {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart(): void {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  logout();
});

function customizeUI(): void {
  const role = localStorage.getItem("role");

  const adminFeatures = document.getElementById(
    "adminFeatures"
  ) as HTMLDivElement;
  const librarianFeatures = document.getElementById(
    "librarianFeatures"
  ) as HTMLDivElement;
  const borrowerFeatures = document.getElementById(
    "borrowerFeatures"
  ) as HTMLDivElement;

  // Hide all role-specific sections initially
  adminFeatures.style.display = "none";
  librarianFeatures.style.display = "none";
  borrowerFeatures.style.display = "none";

  // Show the appropriate section based on the user's role
  if (role === "1") {
    adminFeatures.style.display = "block"; // Show admin features
  } else if (role === "2") {
    librarianFeatures.style.display = "block"; // Show librarian features
  } else if (role === "3") {
    borrowerFeatures.style.display = "block"; // Show borrower features
  }
}

// Admin: Create Book
document.getElementById("createBookBtn")?.addEventListener("click", () => {
  const createBookForm = document.getElementById(
    "createBookForm"
  ) as HTMLDivElement;
  createBookForm.style.display = "block";
});

document.getElementById("closeCreateForm")?.addEventListener("click", () => {
  const createBookForm = document.getElementById(
    "createBookForm"
  ) as HTMLDivElement;
  createBookForm.style.display = "none";
});

// Admin: Delete User
document.getElementById("deleteUserBtn")?.addEventListener("click", () => {
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
        } else {
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
document.getElementById("deleteBookBtn")?.addEventListener("click", () => {
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
        } else {
          alert("Failed to delete book");
        }
      })
      .catch((err) => {
        console.error("Error deleting book:", err);
        alert("Server error");
      });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  customizeUI(); // Customize the UI based on the user's role
  initial(); // Fetch and display books
});

function logout(): void {
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
      } else {
        console.error("Logout failed");
      }
    })
    .catch((err) => {
      console.error("Error during logout:", err);
    });

  window.location.href = "index.html";
}

// Initial data fetch
async function initial(): Promise<void> {
  const data = await fetchData();
  displayAllBooks(data);
}
