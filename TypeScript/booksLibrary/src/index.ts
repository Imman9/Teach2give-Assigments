const api: string = "http://localhost:3000/Books";

interface Book {
  title: string;
  author: string;
  genre: string;
  year: number;
  pages: number;
  cost: number;
  image: string;
}

interface CartItem extends Book {
  quantity: number;
}

let cart: CartItem[] = [];
const cartContainer = document.querySelector(".cart-items") as HTMLDivElement;
const countElement = document.getElementById("count") as HTMLElement;

async function fetchData(): Promise<Book[] | null> {
  try {
    const res = await fetch(api);
    const data: Book[] = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching data: ", err);
    return null;
  }
}

async function displayAllBooks(data: Book[] | null): Promise<void> {
  const booksContainer = document.getElementById(
    "booksContainer"
  ) as HTMLDivElement;
  booksContainer.innerHTML = "";

  if (!data) {
    const errorMsg = document.getElementById("errorMsg") as HTMLDivElement;
    errorMsg.style.display = "block";
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
        <button class="shop-now">Buy Now <h2><strong>$${book.cost}</strong></h2></button>
    `;
    booksContainer.appendChild(card);

    const buyBtn = card.querySelector(".shop-now") as HTMLButtonElement;
    buyBtn.addEventListener("click", () => {
      addToCart(book);
    });
  });
}

async function sortBooksBy(
  property: keyof Book,
  order: "asc" | "desc" = "asc"
): Promise<void> {
  const data = await fetchData();
  if (!data) return;

  data.sort((a, b) =>
    order === "asc"
      ? Number(a[property]) - Number(b[property])
      : Number(b[property]) - Number(a[property])
  );
  displayAllBooks(data);
}

document
  .getElementById("sortAsc")
  ?.addEventListener("click", () => sortBooksBy("year", "asc"));
document
  .getElementById("sortDesc")
  ?.addEventListener("click", () => sortBooksBy("year", "desc"));

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
      if (selectedGenre) {
        const filteredData =
          data?.filter((d) => d.genre === selectedGenre) || [];
        displayAllBooks(filteredData);
      } else {
        displayAllBooks(data);
      }
    });
}

initial();

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

async function searchBooks(): Promise<void> {
  const query = (
    document.getElementById("searchInput") as HTMLInputElement
  ).value.toLowerCase();
  const data = await fetchData();

  if (!data) return;

  const filteredData = data.filter((book) =>
    book.title.toLowerCase().includes(query)
  );
  document.getElementById("errorMsg")!.style.display = filteredData.length
    ? "none"
    : "block";
  displayAllBooks(filteredData);
}
