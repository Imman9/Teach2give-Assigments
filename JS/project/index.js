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

    const buyBtn = card.querySelector(".shop-now");
    buyBtn.addEventListener("click", () => {
      addToCart(book.title, book.image);
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
    cartCard.style.display = "none"; 
  } else {
    cartCard.style.display = "block"; 
  }
});

let cart = new Array();
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

function removeFromCart(title) {
  cart = cart.filter((item) => item.title !== title); // Remove item completely
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

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-details">
            <h4>${item.title}</h4>
            <div class="quantity-control">
                <button class="qty-btn decrease" onclick="changeQuantity('${item.title}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn increase" onclick="changeQuantity('${item.title}', 1)">+</button>
            </div>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${item.title}')">Remove</button>
    `;
    cartContainer.appendChild(cartItem);
  });
}
