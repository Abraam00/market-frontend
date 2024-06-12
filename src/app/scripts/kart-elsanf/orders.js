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

let orders;
let filteredOrders;
const ordersPerPage = 10;
let currentPage = 1;

axios
	.get(
		`https://marketbackend.azurewebsites.net/api/Order/getOrderByDateRangeWithProductId?productId=${productId}&StartDate=${startDate}&EndDate=${endDate}`
	)
	.then((response) => {
		orders = response.data;
		filteredOrders = orders.filter((order) =>
			order.orderItems.some(
				(item) => String(item.unitType).toLowerCase() === unitType.toLowerCase()
			)
		);
		renderTable(currentPage);
	})
	.catch((error) => {
		console.error("Error fetching data:", error);
	});

function renderTable(page) {
	const start = (page - 1) * ordersPerPage;
	const end = start + ordersPerPage;
	const paginatedOrders = filteredOrders.slice(start, end);

	tableContainer.innerHTML = ""; // Clear previous content

	paginatedOrders.forEach((order) => {
		const table = document.createElement("table");
		table.setAttribute("border", "1");

		const thead = document.createElement("thead");
		const trHead = document.createElement("tr");
		const thName = document.createElement("th");
		const thUnitType = document.createElement("th");
		const thUnitPrice = document.createElement("th");
		const thQuantity = document.createElement("th");
		const thTotal = document.createElement("th");
		const thQuantityAtTime = document.createElement("th");
		const thDate = document.createElement("th");
		const thOrderId = document.createElement("th");
		thName.textContent = "الاسم";
		thDate.textContent = "التاريخ";
		thUnitType.textContent = "الوحدة";
		thUnitPrice.textContent = "السعر";
		thQuantity.textContent = "العدد";
		thTotal.textContent = "المجموع";
		thQuantityAtTime.textContent = "الكمية وقت الشراء";
		thOrderId.textContent = "رقم العملية";

		trHead.appendChild(thTotal);
		trHead.appendChild(thQuantityAtTime);
		trHead.appendChild(thQuantity);
		trHead.appendChild(thUnitPrice);
		trHead.appendChild(thUnitType);
		trHead.appendChild(thOrderId);
		trHead.appendChild(thDate);
		trHead.appendChild(thName);
		thead.appendChild(trHead);
		table.appendChild(thead);
		const tbody = document.createElement("tbody");

		order.orderItems.forEach((item) => {
			const trBody = document.createElement("tr");
			const tdName = document.createElement("td");
			const tdDate = document.createElement("td");
			const tdOrderId = document.createElement("td");
			const tdUnitType = document.createElement("td");
			const tdUnitPrice = document.createElement("td");
			const tdQuantity = document.createElement("td");
			const tdQuantityAtTime = document.createElement("td");
			const tdTotal = document.createElement("td");
			tdName.textContent = item.productName;
			tdDate.textContent = formatDate(order.orderDate);
			tdOrderId.textContent = order.orderId;
			tdUnitType.textContent = item.unitType;
			tdUnitPrice.textContent = item.priceAfterTax;
			tdQuantity.textContent = item.quantity;
			tdQuantityAtTime.textContent = item.quantitySnapShot;
			tdTotal.textContent = item.quantity * item.priceAfterTax;

			trBody.appendChild(tdTotal);
			trBody.appendChild(tdQuantityAtTime);
			trBody.appendChild(tdQuantity);
			trBody.appendChild(tdUnitPrice);
			trBody.appendChild(tdUnitType);
			trBody.appendChild(tdOrderId);
			trBody.appendChild(tdDate);
			trBody.appendChild(tdName);
			tbody.appendChild(trBody);
		});

		table.appendChild(tbody);
		if (order.customerName != null) {
			const nameLabel = document.createElement("h2");
			nameLabel.textContent = order.customerName + " (agel)";
			nameLabel.id = "labels";
			tableContainer.appendChild(nameLabel);
		}
		tableContainer.appendChild(table);
	});

	// Update pagination controls
	document.getElementById(
		"pageInfo"
	).textContent = `Page ${page} of ${Math.ceil(
		filteredOrders.length / ordersPerPage
	)}`;
	document.getElementById("prevPage").disabled = page === 1;
	document.getElementById("nextPage").disabled =
		page === Math.ceil(filteredOrders.length / ordersPerPage);
}

document.getElementById("prevPage").addEventListener("click", () => {
	if (currentPage > 1) {
		currentPage--;
		renderTable(currentPage);
	}
});

document.getElementById("nextPage").addEventListener("click", () => {
	if (currentPage < Math.ceil(filteredOrders.length / ordersPerPage)) {
		currentPage++;
		renderTable(currentPage);
	}
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
