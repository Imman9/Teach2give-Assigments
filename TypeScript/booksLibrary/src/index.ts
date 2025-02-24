const api: string = "http://localhost:3000/Books";

type Book = {
  title: string;
  image: string;
  author: string;
  genre: string;
  year: number;
  pages: number;
  cost: number;
};

type CartItem = {
  title: string;
  image: string;
  cost: number;
  quantity: number;
};

let cart: CartItem[] = [];

async function fetchData(): Promise<Book[] | undefined> {
  try {
    const res = await fetch(api);
    const data: Book[] = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching data: ", err);
  }
}

async function displayAllBooks(data: Book[] | undefined): Promise<void> {
  const booksContainer = document.getElementById(
    "booksContainer"
  ) as HTMLElement;
  booksContainer.innerHTML = "";

  if (!data) {
    (document.getElementById("errorMsg") as HTMLElement).style.display =
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

    const buyBtn = card.querySelector(".shop-now") as HTMLButtonElement;
    buyBtn.addEventListener("click", () => {
      addToCart(book);
    });
  });
}

async function filteredBooks(genre: string): Promise<void> {
  const data = await fetchData();
  if (!data) return;
  const filteredData = data.filter((d) => d.genre === genre);
  displayAllBooks(filteredData);
}

async function sortBooksBy(
  property: keyof Book,
  order: "asc" | "desc" = "asc"
): Promise<void> {
  const data = await fetchData();
  if (!data) return;

  data.sort((a, b) => {
    const valA = Number(a[property]);
    const valB = Number(b[property]);

    return order === "asc" ? valA - valB : valB - valA;
  });

  displayAllBooks(data);
}

async function initial(): Promise<void> {
  const data = await fetchData();
  displayAllBooks(data);

  document
    .getElementById("searchInput")
    ?.addEventListener("input", searchBooks);
  document
    .getElementById("genreFilter")
    ?.addEventListener("change", async (event) => {
      const selectedGenre = (event.target as HTMLSelectElement).value;
      selectedGenre ? filteredBooks(selectedGenre) : displayAllBooks(data);
    });
}

initial();

const cartCard = document.getElementById("cart") as HTMLElement;
const cartToggle = document.getElementById("toggleCartBtn") as HTMLElement;

cartToggle.addEventListener("click", () => {
  cartCard.style.display =
    cartCard.style.display === "block" ? "none" : "block";
});

const cartContainer = document.querySelector(".cart-items") as HTMLElement;
const countElement = document.getElementById("count") as HTMLElement;

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
    item.quantity = Math.max(1, item.quantity + change);
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

async function searchBooks(): Promise<void> {
  const query = (
    document.getElementById("searchInput") as HTMLInputElement
  ).value.toLowerCase();
  const data = await fetchData();

  if (!data) return;

  const filteredData = data.filter((book) =>
    book.title.toLowerCase().includes(query)
  );

  if (filteredData.length === 0) {
    (document.getElementById("errorMsg") as HTMLElement).style.display =
      "block";
    document.getElementById("booksContainer")!.innerHTML = "";
  } else {
    (document.getElementById("errorMsg") as HTMLElement).style.display = "none";
    displayAllBooks(filteredData);
  }
}
