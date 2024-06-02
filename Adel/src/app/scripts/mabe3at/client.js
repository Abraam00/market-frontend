const axios = require("axios");

// API Endpoints
const apiEndpoints = {
	getAllProductNames:
		"https://marketbackend.azurewebsites.net/api/Product/GetAllProductsNames",
	getCustomer: (customerNumber) =>
		`https://marketbackend.azurewebsites.net/api/Customer/GetCustomer?customerNumber=${customerNumber}`,
	getProductByName: (query) =>
		`https://marketbackend.azurewebsites.net/api/Product/GetProductByName/${query}`,
	getProductBySerial: (serial) =>
		`https://marketbackend.azurewebsites.net/api/Product/GetProductBy?serialNumber=${serial}`,
	createOrder: "https://marketbackend.azurewebsites.net/api/Order/CreateOrder",
	updateCustomer: (customerId) =>
		`https://marketbackend.azurewebsites.net/api/Customer/UpdateCustomer/${customerId}`,
};

// Global State
const GlobalState = {
	orderItems: [],
};

// DOM Elements
const table = document.querySelector("table");
const tbody = table.querySelector("tbody");
const totalPrice = document.getElementById("total");
const payButton = document.getElementById("payButton");
const paidAmount = document.getElementById("payInput");
const taxRateInput = document.getElementById("taxRateInput");
const productSearch = document.getElementById("searchInput");
const nameHeader = document.getElementById("nameHeader");
const madyonya = document.getElementById("madyonya");

// Variables
let productNames = [];
let customer;
let moneyRemaining;
let itemTotal = 0;
let total = 0;
let scannedBarcode = "";

// Initialize
initializePage();

// Event Listeners
document
	.getElementById("backButton")
	.addEventListener("click", () => window.history.back());
productSearch.addEventListener("input", updateDropdown);
document.addEventListener("click", closeDropdownOnClickOutside);
payButton.addEventListener("click", handlePayment);
document.addEventListener("keydown", handleBarcodeInput);

// Functions
function initializePage() {
	const name = getQueryParam("name");
	const customerNumber = getQueryParam("customerNumber");

	nameHeader.textContent = "اسم العميل: " + name;

	axios
		.get(apiEndpoints.getAllProductNames)
		.then((response) => (productNames = response.data))
		.catch((error) => console.error("Error fetching data:", error));

	axios
		.get(apiEndpoints.getCustomer(customerNumber))
		.then((response) => {
			customer = response.data;
			moneyRemaining = customer.moneyRemaining;
			madyonya.textContent = moneyRemaining;
		})
		.catch((error) => console.error("Error fetching data:", error));
}

function getQueryParam(param) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param);
}

function updateDropdown() {
	const searchTerm = productSearch.value.toLowerCase();
	const filteredItems = productNames.filter((item) =>
		item.toLowerCase().includes(searchTerm)
	);
	const dropdownList = document.getElementById("dropdownList");

	dropdownList.innerHTML = "";

	filteredItems.forEach((item) => {
		const li = document.createElement("li");
		li.textContent = item;
		li.addEventListener("click", () => {
			productSearch.value = item;
			getProduct(item);
			dropdownList.style.display = "none";
		});
		dropdownList.appendChild(li);
	});

	dropdownList.style.display = filteredItems.length > 0 ? "block" : "none";
}

function closeDropdownOnClickOutside(event) {
	if (
		!event.target.matches("#searchInput") &&
		!event.target.matches("#dropdownList li")
	) {
		document.getElementById("dropdownList").style.display = "none";
	}
}

function handlePayment() {
	const moneyBack =
		parseInt(paidAmount.value) - parseInt(totalPrice.textContent);

	if (moneyBack > 0) {
		moneyRemaining -= moneyBack;
		if (moneyRemaining < 0) {
			alert("Money to give back: " + -moneyRemaining);
			moneyRemaining = 0;
		}
		madyonya.textContent = moneyRemaining;
	} else {
		moneyRemaining += -moneyBack;
		madyonya.textContent = moneyRemaining;
	}

	updateCustomer(customer.name, customer.customerNumber, moneyRemaining);
	createOrder(customer.customerId, parseInt(paidAmount.value));

	resetOrder();
}

function resetOrder() {
	while (tbody.firstChild) {
		tbody.removeChild(tbody.firstChild);
	}
	GlobalState.orderItems = [];
	totalPrice.textContent = "";
	productSearch.value = "";
	paidAmount.value = "";
	itemTotal = 0;
	total = 0;
}

function handleBarcodeInput(event) {
	if (event.key.length === 1) {
		scannedBarcode += event.key;
	} else if (event.key === "Enter") {
		getProductBySerial(scannedBarcode);
		scannedBarcode = "";
	}
}

function getProduct(query) {
	axios
		.get(apiEndpoints.getProductByName(query))
		.then((response) => addProductToTable(response.data))
		.catch((error) => console.error("Error fetching product:", error));
}

function getProductBySerial(serial) {
	axios
		.get(apiEndpoints.getProductBySerial(serial))
		.then((response) => addProductToTable(response.data))
		.catch((error) =>
			console.error("Error fetching product by serial:", error)
		);
}

function addProductToTable(product) {
	const row = tbody.insertRow();
	const unitsOfSale = product.unitsOfSale;

	const deleteCell = row.insertCell(0);
	const deleteButton = document.createElement("button");
	deleteButton.textContent = "delete";
	deleteButton.addEventListener("click", () => {
		removeProductFromTable(row, product.productId, dropdown.value);
	});
	deleteCell.appendChild(deleteButton);

	row.insertCell(1).textContent = product.productId;

	const totalCell = row.insertCell(2);
	const countInput = document.createElement("input");
	const priceInput = createPriceInput(unitsOfSale);
	const dropdown = createUnitDropdown(unitsOfSale, priceInput);

	countInput.addEventListener("keyup", (event) => {
		if (event.key === "Enter") {
			const itemTotal = calculateItemTotal(countInput, priceInput);
			totalCell.textContent = itemTotal;
			total += itemTotal;
			totalPrice.textContent = total;
			const selectedUnit = unitsOfSale.find(
				(unit) => unit.name === dropdown.value
			);
			if (selectedUnit && validateQuantity(selectedUnit, countInput.value)) {
				updateGlobal(product, selectedUnit, countInput.value, priceInput.value);
				disableInputs(countInput, priceInput, dropdown);
			} else {
				alert("معندكش كفاية");
			}
		}
	});

	row.insertCell(3).appendChild(countInput);
	row.insertCell(4).appendChild(priceInput);
	row.insertCell(5).appendChild(dropdown);
	row.insertCell(6).textContent = product.name;
}

function createPriceInput(unitsOfSale) {
	const priceInput = document.createElement("input");
	priceInput.value = unitsOfSale[0].salePrice;
	return priceInput;
}

function createUnitDropdown(unitsOfSale, priceInput) {
	const dropdown = document.createElement("select");
	unitsOfSale.forEach((unit) => {
		const option = document.createElement("option");
		option.value = unit.name;
		option.textContent = unit.name;
		dropdown.appendChild(option);
	});
	dropdown.addEventListener("change", () => {
		const selectedUnit = unitsOfSale.find(
			(unit) => unit.name === dropdown.value
		);
		if (selectedUnit) priceInput.value = selectedUnit.salePrice;
	});
	return dropdown;
}

function calculateItemTotal(countInput, priceInput) {
	return parseInt(countInput.value) * parseInt(priceInput.value);
}

function validateQuantity(selectedUnit, count) {
	return selectedUnit.quantity != 0 && parseInt(count) <= selectedUnit.quantity;
}

function disableInputs(countInput, priceInput, dropdown) {
	countInput.disabled = true;
	priceInput.disabled = true;
	dropdown.disabled = true;
}

function removeProductFromTable(row, productId, unitOfSale) {
	const rowIndex = row.rowIndex;
	const removableTotal = parseInt(row.cells[2].innerText);
	total -= removableTotal;
	totalPrice.textContent = total;
	table.deleteRow(rowIndex);
	removeFromGlobal(productId, unitOfSale);
}

function removeFromGlobal(productId, unitOfSale) {
	const index = GlobalState.orderItems.findIndex(
		(item) =>
			item.productId === parseInt(productId) && item.unitType === unitOfSale
	);
	if (index > -1) GlobalState.orderItems.splice(index, 1);
}

function updateGlobal(product, unitOfSale, count, salePrice) {
	GlobalState.orderItems.push({
		productId: product.productId,
		quantity: parseInt(count),
		unitType: unitOfSale.name,
		salePrice: parseInt(salePrice),
	});
}

function updateCustomer(name, customerNumber, moneyRemaining) {
	axios
		.put(apiEndpoints.updateCustomer(customer.customerId), {
			name: name,
			customerNumber: customerNumber,
			moneyRemaining: moneyRemaining,
		})
		.catch((error) => console.error("Error updating customer:", error));
}

function createOrder(customerId, moneyPaid) {
	axios
		.post(apiEndpoints.createOrder, {
			customerId: customerId,
			orderItems: GlobalState.orderItems,
			paymentType: "agel",
			moneyPaid: moneyPaid,
			orderNumber: "",
			taxRate: taxRateInput.value,
		})
		.then((response) => {
			console.log("Order created:", response.data);
			GlobalState.orderItems.length = 0;
		})
		.catch((error) => console.error("Error creating order:", error));
}
