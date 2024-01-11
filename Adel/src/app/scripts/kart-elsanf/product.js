const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const name = getQueryParam("name");
const productId = getQueryParam("productId");
const startDate = getQueryParam("startDate");
const endDate = getQueryParam("endDate");

let items;
axios
  .get(
    `https://localhost:7163/api/Product/GetProductIdCard?productId=${productId}&StartDate=${dateformatter(
      startDate
    )}&EndDate=${dateformatter(endDate)}`
  )
  .then((response) => {
    items = response.data;
    items.forEach((item) => {
      populateTable(item);
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function dateformatter(dateString) {
  const dateParts = dateString.split("-");
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Months in JavaScript are 0-based (0-11)
  const day = parseInt(dateParts[2], 10);

  const formattedDate = new Date(year, month, day);

  // Now, if you want to display it in the same format, you can use the toLocaleDateString method:
  const formattedDateString = formattedDate.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formattedDateString;
}

const table = document.querySelector("table");
const tbody = table.querySelector("tbody");

function populateTable(item) {
  const row = tbody.insertRow();

  const cellTotal = row.insertCell(0);
  cellTotal.textContent = item.totalQuantity;

  const cellPurchases = row.insertCell(1);
  cellPurchases.textContent = item.quantityPurchased;

  const cellSales = row.insertCell(2);
  cellSales.textContent = item.quantitySold;

  const cellType = row.insertCell(3);
  cellType.textContent = item.unitType;

  const cellName = row.insertCell(4);
  cellName.textContent = name;
}
