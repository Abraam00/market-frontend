const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});

// Get the button container element
const buttonContainer = document.getElementById("buttonContainer");

let customers;
axios
  .get("https://localhost:7163/api/Customer/GetAllCustomers")
  .then((response) => {
    customers = response.data;
    // Create buttons dynamically based on the names
    customers.forEach((customer) => {
      const button = document.createElement("button");
      button.className = "big-button";
      button.textContent = customer.name;

      button.addEventListener("click", () => {
        // Construct the URL with the name as a query parameter
        const url = `clientHistory.html?name=${encodeURIComponent(
          customer.name
        )}`;

        window.location.href = url;
      });

      buttonContainer.appendChild(button);
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
