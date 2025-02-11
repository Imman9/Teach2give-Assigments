// async function fetchProducts() {
//   try {
//     const response = await fetch("http://localhost:5000/products");
//     const products = await response.json();

//     const productContainer = document.getElementById("product-container");
//     productContainer.innerHTML = "";

//     products.forEach((product) => {
//       const productDiv = getElement("div");
//       productDiv.classList.add("product");
//       productDiv.innerHTML = `
//                 <h2>${product.name}</h2>
//                 <p>${product.description}</p>
//                 <p><strong>Price:</strong> $${product.price}</p>
//                 <p><strong>Category:</strong> ${product.category}</p>
//                 <p><strong>Stock:</strong> ${product.stock}</p>
//             `;
//       productContainer.appendChild(productDiv);
//     });
//   } catch (error) {
//     console.log("Error fetching products:", error);
//   }
// }
// fetchProducts();
