const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});

// Get the button container element
const buttonContainer = document.getElementById("buttonContainer");

let products;
axios
  .get("https://localhost:7163/api/Product/GetAllProducts")
  .then((response) => {
    products = response.data;
    // Create buttons dynamically based on the names
    renderButtons(products);

    // Add event listener to search input
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredproducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
      );
      renderButtons(filteredproducts);
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function renderButtons(productsToRender) {
  // Clear existing buttons
  buttonContainer.innerHTML = "";

  // Create buttons based on the provided products
  productsToRender.forEach((product) => {
    const button = document.createElement("button");
    button.className = "big-button";
    button.textContent = product.name;

    button.addEventListener("click", () => {
      // Construct the URL with the name as a query parameter
      const url = `date.html?name=${encodeURIComponent(
        product.name
      )}&productId=${encodeURIComponent(product.productId)}`;

      window.location.href = url;
    });

    buttonContainer.appendChild(button);
  });
}
