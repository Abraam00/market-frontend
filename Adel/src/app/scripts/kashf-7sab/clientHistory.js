const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});

// Function to get the query parameter from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
const table = document.querySelector("table");
const tbody = table.querySelector("tbody");

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

    orders.forEach((order) => {
      const row = tbody.insertRow();

      const cellTotal = row.insertCell(0);
      cellTotal.textContent = order.total;

      const cellorderId = row.insertCell(1);
      cellorderId.textContent = order.orderId;
      cellorderId.addEventListener("dblclick", () => {
        const url = `client.html?orderId=${encodeURIComponent(
          order.orderId
        )}&moneyRemaining=${encodeURIComponent(customer.moneyRemaining)}`;

        window.location.href = url;
      });

      const cellDate = row.insertCell(2);
      cellDate.textContent = formatDate(order.orderDate);

      const cellcustomerNumber = row.insertCell(3);
      cellcustomerNumber.textContent = customer.customerNumber;

      const cellName = row.insertCell(4);
      cellName.textContent = customer.name;
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

  const hour = String(dateObject.getHours()).padStart(2, "0");
  const minute = String(dateObject.getMinutes()).padStart(2, "0");

  const formattedDate = day + "/" + month + "/" + year;
  const formattedTime = hour + ":" + minute;

  return formattedDate + " " + formattedTime;
}
