const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});
// Get the button container element

// Function to get the query parameter from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
const table = document.querySelector("table");
const tbody = table.querySelector("tbody");

let purchases;
let company;
axios
  .get(
    `https://localhost:7163/api/Company/GetCompanyById/${getQueryParam(
      "companyId"
    )}`
  )
  .then((response) => {
    company = response.data;
    purchases = response.data.purchases;

    purchases.forEach((purchase) => {
      const row = tbody.insertRow();

      const cellTotal = row.insertCell(0);
      cellTotal.textContent = purchase.total;

      const cellPurchaseId = row.insertCell(1);
      cellPurchaseId.textContent = purchase.purchaseId;
      cellPurchaseId.addEventListener("dblclick", () => {
        const url = `company.html?purchaseId=${encodeURIComponent(
          purchase.purchaseId
        )}`;

        window.location.href = url;
      });

      const cellDate = row.insertCell(2);
      cellDate.textContent = formatDate(purchase.purchaseDate);

      const cellCompanyNumber = row.insertCell(3);
      cellCompanyNumber.textContent = company.companyNumber;

      const cellName = row.insertCell(4);
      cellName.textContent = company.companyName;
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
