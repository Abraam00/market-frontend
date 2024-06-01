const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
	window.history.back();
});

// Function to get the query parameter from the URL
function getQueryParam(param) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param);
}

const orderId = parseInt(getQueryParam("orderId"));
const moneyRemaining = getQueryParam("moneyRemaining");
const table = document.querySelector("table"); // Assuming you have a <table> element in your HTML
const tbody = table.querySelector("tbody");
const totalPrice = document.getElementById("total");
const madyonya = document.getElementById("moneyRemaining");
madyonya.textContent = moneyRemaining;
const transactionId = document.getElementById("transactionId");
transactionId.textContent = "رقم العملية:" + orderId;

let orderItems;
let order;
axios
	.get(
		`https://marketbackend.azurewebsites.net/api/Order/GetOrderById?orderId=${orderId}`
	)
	.then((response) => {
		order = response.data;
		orderItems = response.data.orderItems;
		orderItems.forEach((item) => {
			const row = tbody.insertRow();

			const cellInventory = row.insertCell(0);
			cellInventory.textContent = item.quantitySnapShot;
			const cellTotal = row.insertCell(1);
			cellTotal.textContent =
				parseInt(item.quantity) * parseInt(item.priceAfterTax);

			const cellCount = row.insertCell(2);
			cellCount.textContent = item.quantity;

			const cellType = row.insertCell(3);
			cellType.textContent = item.unitType;

			const cellPrice = row.insertCell(4);
			cellPrice.textContent = item.priceAfterTax;

			const cellName = row.insertCell(5);
			cellName.textContent = item.productName;
		});
		totalPrice.textContent = "Total: " + order.total;
	})
	.catch((error) => {
		console.error("Error fetching data:", error);
	});
