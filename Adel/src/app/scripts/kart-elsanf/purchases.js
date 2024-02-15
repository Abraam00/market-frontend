const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const unitType = getQueryParam("unitType");
const productId = getQueryParam("productId");
const startDate = getQueryParam("startDate");
const endDate = getQueryParam("endDate");
const tableContainer = document.getElementById("table-container");
let purchases;

axios
  .get(
    `https://localhost:7163/api/Purchase/GetPurchasesByDateRangeWithProductId?productId=${productId}&StartDate=${startDate}&EndDate=${endDate}`
  )
  .then((response) => {
    purchases = response.data;
    const purchasesWithUnitType = purchases.filter((purchase) =>
      purchase.purchaseItems.some(
        (item) => String(item.unitType).toLowerCase() === unitType.toLowerCase()
      )
    );
    purchasesWithUnitType.forEach((purchase) => {
      const table = document.createElement("table");
      table.setAttribute("border", "1");

      const thead = document.createElement("thead");
      const trHead = document.createElement("tr");
      const thName = document.createElement("th");
      const thUnitType = document.createElement("th");
      const thUnitPrice = document.createElement("th");
      const thQuantity = document.createElement("th");
      const thTotal = document.createElement("th");
      const thDate = document.createElement("th");
      thName.textContent = "الاسم";
      thDate.textContent = "التاريخ";
      thUnitType.textContent = "الوحدة";
      thUnitPrice.textContent = "السعر";
      thQuantity.textContent = "العدد";
      thTotal.textContent = "المجموع";

      trHead.appendChild(thTotal);
      trHead.appendChild(thQuantity);
      trHead.appendChild(thUnitPrice);
      trHead.appendChild(thUnitType);
      trHead.appendChild(thDate);
      trHead.appendChild(thName);
      thead.appendChild(trHead);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");

      // Iterate over order properties to create table cells
      purchase.purchaseItems.forEach((item) => {
        const trBody = document.createElement("tr");
        const tdName = document.createElement("td");
        const tdDate = document.createElement("td");
        const tdUnitType = document.createElement("td");
        const tdUnitPrice = document.createElement("td");
        const tdQuantity = document.createElement("td");
        const tdTotal = document.createElement("td");
        tdName.textContent = item.productName;
        tdDate.textContent = formatDate(purchase.purchaseDate);
        tdUnitType.textContent = item.unitType;
        tdUnitPrice.textContent = item.unitPrice;
        tdQuantity.textContent = item.quantity;
        tdTotal.textContent = item.quantity * item.unitPrice;

        trBody.appendChild(tdTotal);
        trBody.appendChild(tdQuantity);
        trBody.appendChild(tdUnitPrice);
        trBody.appendChild(tdUnitType);
        trBody.appendChild(tdDate);
        trBody.appendChild(tdName);
        tbody.appendChild(trBody);
      });

      table.appendChild(tbody);
      if (purchase.companyName != null) {
        const nameLabel = document.createElement("h2");
        nameLabel.textContent = purchase.companyName;
        nameLabel.id = "labels";
        tableContainer.appendChild(nameLabel);
      }
      tableContainer.appendChild(table);
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
