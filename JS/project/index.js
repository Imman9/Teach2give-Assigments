const api = "http://localhost:3000/Books";

async function fetchData() {
  try {
    const res = await fetch(api);
    if (!res.ok) throw new Error("Error in API url");
    return await res.json();
  } catch (err) {
    console.error("Error fetching data: ", err);
  }
}

async function displayAllBooks(data) {
  const booksContainer = document.getElementById("booksContainer");
  booksContainer.innerHTML = "";

  if (!data) {
    document.getElementById("errorMsg").style.display = "block";
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

async function sortBooksBy(prop, order = "asc") {
  const data = await fetchData();
  if (!data) return;

  data.sort((a, b) =>
    order === "asc" ? a[prop] - b[prop] : b[prop] - a[prop]
  );
  displayAllBooks(data);
}

async function initializer() {
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

initializer();
