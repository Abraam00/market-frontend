const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});
// Get the button container element
const buttonContainer = document.getElementById("buttonContainer");

// Function to get the query parameter from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// // Get the name query parameter from the URL
// const name = getQueryParam("name");
let orders;
let customer;
axios
  .get(
    `https://localhost:7163/api/Customer/GetCustomer/?name=${getQueryParam(
      "name"
    )}`
  )
  .then((response) => {
    customer = response.data;
    orders = response.data.orders;
    // Create buttons dynamically based on the names
    orders.forEach((order) => {
      const button = document.createElement("button");
      button.className = "big-button";
      button.textContent = formatDate(order.orderDate);

      button.addEventListener("click", () => {
        // Construct the URL with the name as a query parameter
        const url = `client.html?name=${encodeURIComponent(
          customer.name
        )}&orderId=${encodeURIComponent(
          order.orderId
        )}&moneyRemaining=${encodeURIComponent(customer.moneyRemaining)}`;

        window.location.href = url;
      });

      buttonContainer.appendChild(button);
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function formatDate(inputDate) {
  const dateObject = new Date(inputDate);

  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = dateObject.getFullYear();

  return day + "/" + month + "/" + year;
}
