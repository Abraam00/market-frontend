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
		`https://marketbackend.azurewebsites.net/api/Product/GetProductIdCard?productId=${productId}&StartDate=${startDate}&EndDate=${endDate}`
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

const table = document.querySelector("table");
const tbody = table.querySelector("tbody");

function populateTable(item) {
	const row = tbody.insertRow();

	const cellTotal = row.insertCell(0);
	cellTotal.textContent = item.totalQuantity;

	const cellPurchases = row.insertCell(1);
	cellPurchases.textContent = item.quantityPurchased;
	cellPurchases.addEventListener("dblclick", () => {
		const url = `purchases.html?unitType=${encodeURIComponent(
			item.unitType
		)}&productId=${encodeURIComponent(
			productId
		)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(
			endDate
		)}`;

		window.location.href = url;
	});

	const cellSales = row.insertCell(2);
	cellSales.textContent = item.quantitySold;
	cellSales.addEventListener("dblclick", () => {
		const url = `orders.html?unitType=${encodeURIComponent(
			item.unitType
		)}&productId=${encodeURIComponent(
			productId
		)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(
			endDate
		)}`;

		window.location.href = url;
	});

	const cellType = row.insertCell(3);
	cellType.textContent = item.unitType;

	const cellName = row.insertCell(4);
	cellName.textContent = name;
}
