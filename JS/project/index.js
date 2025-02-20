const api = "http://localhost:3000/Books";

async function fetchData() {
  try {
    const res = await fetch(api);
    const data = res.json();
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

  document.getElementById("errorMsg");

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
        <button class="shop-now" id="shop-now">Buy Now</button>
    `;
    booksContainer.appendChild(card);
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
  const genreFilter = document.getElementById("genreFilter");
  genreFilter.addEventListener("change", async (event) => {
    const selectedGenre = event.target.value;
    if (selectedGenre) {
      filteredBooks(selectedGenre);
    } else {
      displayAllBooks(await fetchData());
    }
  });
}

initial();

const cartCard = document.getElementById("cart");
const cartToggle = document.getElementById("toggleCartBtn");

cartToggle.addEventListener("click", function () {
  if (cartCard.style.display === "block") {
    cartCard.style.display = "none"; // Hide cart
  } else {
    cartCard.style.display = "block"; // Show cart
  }
});

const cart = new Array();
const cartContainer = document.querySelector(".cart-items");
const countElement = document.getElementById("count");
function addToCart(title, image) {
  const existingItem = cart.find((item) => item.title === title);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ title, image, quantity: 1 });
  }
  updateCart();
}
function updateCart() {
  cartContainer.innerHTML = "";
  countElement.innerText = cart.length;

  cart.map((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
    
    `;
  });
}
