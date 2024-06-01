const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
	window.history.back();
});

// Function to get the query parameter from the URL
function getQueryParam(param) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param);
}

const purchaseId = parseInt(getQueryParam("purchaseId"));
const table = document.querySelector("table");
const tbody = table.querySelector("tbody");
const totalPrice = document.getElementById("total");
const transactionId = document.getElementById("transactionId");
transactionId.textContent = "رقم العملية:" + purchaseId;

let purchaseItems;
let purchase;
axios
	.get(
		`https://marketbackend.azurewebsites.net/api/purchase/Getpurchase?purchaseId=${purchaseId}`
	)
	.then((response) => {
		purchase = response.data;
		purchaseItems = response.data.purchaseItems;
		purchaseItems.forEach((item) => {
			const row = tbody.insertRow();

			const cellInventory = row.insertCell(0);
			cellInventory.textContent = item.quantitySnapShot;

			const cellTotal = row.insertCell(1);
			cellTotal.textContent =
				parseInt(item.quantity) * parseInt(item.unitPrice);

			const cellCount = row.insertCell(2);
			cellCount.textContent = item.quantity;

			const cellType = row.insertCell(3);
			cellType.textContent = item.unitType;

			const cellPrice = row.insertCell(4);
			cellPrice.textContent = item.unitPrice;

			const cellName = row.insertCell(5);
			cellName.textContent = item.productName;
		});
		totalPrice.textContent = "Total: " + purchase.total;
	})
	.catch((error) => {
		console.error("Error fetching data:", error);
	});
