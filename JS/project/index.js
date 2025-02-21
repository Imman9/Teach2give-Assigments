const api = "http://localhost:3000/Books";

async function fetchData() {
  try {
    const res = await fetch(api);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching data: ", err);
  }
}

async function displayAllBooks(data) {
  const booksContainer = document.getElementById("booksContainer");
  booksContainer.innerHTML = "";

  if (!data) {
    document.getElementById("errorMsg").style.display = "";
    return;
  }

  data.map((book) => {
    const card = document.createElement("div");
    card.classList.add("book");
    card.innerHTML = `
        <img src="${book.image}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>Year:</strong> ${book.year}</p>
        <p><strong>Pages:</strong> ${book.pages}</p>
        <button class="shop-now" id="shop-now">Buy Now <h2><strong>$${book.cost}</strong></h2></button>
    `;
    booksContainer.appendChild(card);

    const buyBtn = card.querySelector(".shop-now");
    buyBtn.addEventListener("click", () => {
      addToCart(book.title, book.image, book.cost);
    });
  });
}

async function filteredBooks(genre) {
  const data = await fetchData();
  if (!data) return;

  const filteredData = data.filter((d) => d.genre === genre);
  displayAllBooks(filteredData);
}

async function sortBooksBy(property, order = "asc") {
  const data = await fetchData();
  if (!data) return;

  data.sort((a, b) =>
    order === "asc" ? a[property] - b[property] : b[property] - a[property]
  );
  displayAllBooks(data);
}

async function initial() {
  const data = await fetchData();
  displayAllBooks(data);
  document.getElementById("searchInput").addEventListener("input", searchBooks);
  document
    .getElementById("genreFilter")
    .addEventListener("change", async (event) => {
      const selectedGenre = event.target.value;
      if (selectedGenre) {
        const filteredData = data.filter((d) => d.genre === selectedGenre);
        displayAllBooks(filteredData);
      } else {
        displayAllBooks(data);
      }
    });
}

initial();

const cartCard = document.getElementById("cart");
const cartToggle = document.getElementById("toggleCartBtn");

cartToggle.addEventListener("click", function () {
  if (cartCard.style.display === "block") {
    cartCard.style.display = "none";
  } else {
    cartCard.style.display = "block";
  }
});

let cart = new Array();
const cartContainer = document.querySelector(".cart-items");
const countElement = document.getElementById("count");

function addToCart(title, image, cost) {
  const existingItem = cart.find((item) => item.title === title);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ title, image, cost, quantity: 1 });
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
    } else if (change === 1) {
      item.quantity++;
    }
  }
  updateCart();
}

function updateCart() {
  cartContainer.innerHTML = "";
  countElement.innerText = cart.length;

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
                <button class="qty-btn decrease" onclick="changeQuantity('${
                  item.title
                }', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn increase" onclick="changeQuantity('${
                  item.title
                }', 1)">+</button>
            </div>
            <p><strong>Total: $${itemTotalCost.toFixed(2)}</strong></p>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${
          item.title
        }')">Remove</button>
        <hr>
    `;
    cartContainer.appendChild(cartItem);
  });

  const totalCostElement = document.createElement("div");
  totalCostElement.classList.add("cart-total");
  totalCostElement.innerHTML = `<h3>Total Cost: $${totalCartCost.toFixed(
    2
  )}</h3>`;
  cartContainer.appendChild(totalCostElement);
}

async function searchBooks() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const data = await fetchData();

  if (!data) {
    return;
  }

  const filteredData = data.filter((book) =>
    book.title.toLowerCase().includes(query)
  );

  if (filteredData.length === 0) {
    document.getElementById("errorMsg").style.display = "block";
    document.getElementById("booksContainer").innerHTML = "";
  } else {
    document.getElementById("errorMsg").style.display = "none";
    displayAllBooks(filteredData);
  }
}
