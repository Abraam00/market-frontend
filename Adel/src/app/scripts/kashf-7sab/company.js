const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});

// Function to get the query parameter from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const name = getQueryParam("name");
const purchaseId = parseInt(getQueryParam("purchaseId"));
const table = document.querySelector("table"); // Assuming you have a <table> element in your HTML
const tbody = table.querySelector("tbody");
const totalPrice = document.getElementById("total");

let purchaseItems;
let purchase;
axios
  .get(
    `https://localhost:7163/api/purchase/Getpurchase?purchaseId=${purchaseId}`
  )
  .then((response) => {
    purchase = response.data;
    purchaseItems = response.data.purchaseItems;
    purchaseItems.forEach((item) => {
      const row = tbody.insertRow();

      const cellTotal = row.insertCell(0);
      cellTotal.textContent =
        parseInt(item.quantity) * parseInt(item.unitPrice);

      const cellCount = row.insertCell(1);
      cellCount.textContent = item.quantity;

      const cellType = row.insertCell(2);
      cellType.textContent = item.unitType;

      const cellPrice = row.insertCell(3);
      cellPrice.textContent = item.unitPrice;

      const cellName = row.insertCell(4);
      cellName.textContent = item.productName;
    });
    totalPrice.textContent = "Total: " + purchase.total;
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
