document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});

// Function to get the query parameter from the URL
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Get the name query parameter from the URL
const name = getQueryParam("name");
const nameHeader = document.getElementById("nameHeader");
nameHeader.textContent = "اسم الشركة: " + name;

const item1 = {
  name: "لبان",
  count: 5,
  type: "علبة",
  priceSale: 30,
  priceBuy: 25,
};
const item2 = {
  name: "لبان",
  count: 5,
  type: "علبة",
  priceSale: 30,
  priceBuy: 25,
};
const item3 = {
  name: "لبان",
  count: 5,
  type: "علبة",
  priceSale: 30,
  priceBuy: 25,
};
const item4 = {
  name: "لبان",
  count: 5,
  type: "علبة",
  priceSale: 30,
  priceBuy: 25,
};

const data = [item1, item2, item3, item4];
const table = document.querySelector("table"); // Assuming you have a <table> element in your HTML
const tbody = table.querySelector("tbody");
let total = 0;

while (tbody.firstChild) {
  tbody.removeChild(tbody.firstChild);
}
data.forEach((item) => {
  const row = tbody.insertRow();

  const cellName = row.insertCell(0);
  cellName.textContent = item.count * item.priceBuy;
  total += item.count * item.priceBuy;

  const cellPriceSale = row.insertCell(1);
  cellPriceSale.textContent = item.priceSale;

  const cellPriceBuy = row.insertCell(2);
  cellPriceBuy.textContent = item.priceBuy;

  const cellType = row.insertCell(3);
  cellType.textContent = item.type;

  const cellCount = row.insertCell(4);
  cellCount.textContent = item.count;

  const cellTotal = row.insertCell(5);
  cellTotal.textContent = item.name;
});

const totalPrice = document.getElementById("total");
totalPrice.textContent = "Total: " + total;
