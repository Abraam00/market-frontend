document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});

const nameHeader = document.getElementById("nameHeader");
nameHeader.textContent = "اسم العامل: " + "جلجل";

const item1 = {
  name: "لبان",
  count: 5,
  type: "علبة",
  price: 30,
};
const item2 = {
  name: "لبان",
  count: 5,
  type: "علبة",
  price: 30,
};
const item3 = {
  name: "لبان",
  count: 5,
  type: "علبة",
  price: 30,
};
const item4 = {
  name: "لبان",
  count: 5,
  type: "علبة",
  price: 30,
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
  cellName.textContent = item.count * item.price;
  total += item.count * item.price;

  const cellCount = row.insertCell(1);
  cellCount.textContent = item.price;

  const cellType = row.insertCell(2);
  cellType.textContent = item.type;

  const cellPrice = row.insertCell(3);
  cellPrice.textContent = item.count;

  const cellTotal = row.insertCell(4);
  cellTotal.textContent = item.name;
});

const totalPrice = document.getElementById("total");
totalPrice.textContent = "Total: " + total;

const payButton = document.getElementById("payButton");
const paidAmount = document.getElementById("payInput");

payButton.addEventListener("click", () => {
  console.log(total - parseInt(paidAmount.value));
});

const agelButton = document.getElementById("agelButton");

agelButton.addEventListener("click", () => {
  window.location.href = "agel.html";
});
