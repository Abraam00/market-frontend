const axios = require("axios");

const apiEndpoints = {
	getAllProductNames:
		"https://marketbackend.azurewebsites.net/api/Product/GetAllProductsNames",
	getProductByName: (query) =>
		`https://marketbackend.azurewebsites.net/api/Product/GetProductByName/${query}`,
	getProductBySerial: (serial) =>
		`https://marketbackend.azurewebsites.net/api/Product/GetProductBy?serialNumber=${serial}`,
	returnOrderItemsWithoutOrderNumber:
		"https://marketbackend.azurewebsites.net/api/Order/returnOrderItemsWithoutOrderNumber",
	returnOrderItemsById: (id) =>
		`https://marketbackend.azurewebsites.net/api/Order/returnOrderItems/${id}`,
};

const GlobalState = {
	orderItems: [],
};

const table = document.querySelector("table");
const tbody = table.querySelector("tbody");
const totalPrice = document.getElementById("total");
const payButton = document.getElementById("payButton");
const productSearch = document.getElementById("searchInput");
const orderIdInput = document.getElementById("orderIdInput");
const agelButton = document.getElementById("agelButton");
const nameHeader = document.getElementById("nameHeader");
const backButton = document.getElementById("backButton");
const dropdownList = document.getElementById("dropdownList");

let productNames = [];
let scannedBarcode = "";
let total = 0;

initializePage();

// Event Listeners
backButton.addEventListener("click", () => window.history.back());
productSearch.addEventListener("input", updateDropdown);
document.addEventListener("click", closeDropdownOnClickOutside);
payButton.addEventListener("click", handlePayment);
agelButton.addEventListener(
	"click",
	() => (window.location.href = "agel.html")
);
document.addEventListener("keydown", handleBarcodeInput);

function initializePage() {
	nameHeader.textContent = "اسم العامل: " + "جلجل";

	axios
		.get(apiEndpoints.getAllProductNames)
		.then((response) => (productNames = response.data))
		.catch((error) => console.error("Error fetching data:", error));
}

function updateDropdown() {
	const searchTerm = productSearch.value.toLowerCase();
	const filteredItems = productNames.filter((item) =>
		item.toLowerCase().includes(searchTerm)
	);
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
		dropdownList.style.display = "none";
	}
}

function handlePayment() {
	alert("money to give back: " + totalPrice.textContent);
	returnOrder(orderIdInput.value);

	while (tbody.firstChild) {
		tbody.removeChild(tbody.firstChild);
	}
	resetGlobalState();
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
	const unitsOfSale = product.unitsOfSale;
	const row = tbody.insertRow();
	const cellDelete = row.insertCell(0);
	const deleteButton = createDeleteButton(row, product.productId);
	const cellProductId = row.insertCell(1);
	const cellTotal = row.insertCell(2);
	const cellCount = row.insertCell(3);
	const cellPrice = row.insertCell(4);
	const cellType = row.insertCell(5);
	const cellName = row.insertCell(6);
	const priceInput = createPriceInput(unitsOfSale);
	const dropdown = createUnitDropdown(unitsOfSale, priceInput);
	const countInput = createCountInput(
		row,
		unitsOfSale,
		product,
		cellTotal,
		dropdown,
		priceInput
	);

	cellDelete.appendChild(deleteButton);
	cellProductId.textContent = product.productId;
	cellCount.appendChild(countInput);
	cellPrice.appendChild(priceInput);
	cellType.appendChild(dropdown);
	cellName.textContent = product.name;
}

function createDeleteButton(row, productId) {
	const deleteButton = document.createElement("button");
	deleteButton.textContent = "delete";
	deleteButton.addEventListener("click", () => {
		const rowIndex = row.rowIndex;
		const unitType = row.cells[5].innerText;
		const removableTotal = row.cells[2].innerText;
		total -= parseInt(removableTotal);
		totalPrice.textContent = total;
		removeFromGlobal(productId, unitType);
		table.deleteRow(rowIndex);
	});
	return deleteButton;
}

function createCountInput(
	row,
	unitsOfSale,
	product,
	cellTotal,
	dropdown,
	priceInput
) {
	const countInput = document.createElement("input");
	countInput.addEventListener("keyup", (event) => {
		if (event.key === "Enter") {
			const selectedUnit = unitsOfSale.find(
				(unit) => unit.name === dropdown.value
			);
			if (selectedUnit && validateQuantity(selectedUnit, countInput.value)) {
				cellTotal.textContent =
					parseInt(countInput.value) * parseInt(priceInput.value);
				updateTotal(parseInt(cellTotal.textContent));
				updateGlobal(product, selectedUnit, countInput.value, priceInput.value);
				disableInputs(countInput, priceInput, dropdown);
			} else {
				alert("معندكش كفاية");
			}
		}
	});
	return countInput;
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

function validateQuantity(selectedUnit, count) {
	return (
		selectedUnit.quantity !== 0 && parseInt(count) <= selectedUnit.quantity
	);
}

function updateTotal(amount) {
	total += amount;
	totalPrice.textContent = total;
}

function disableInputs(...inputs) {
	inputs.forEach((input) => (input.disabled = true));
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

function resetGlobalState() {
	GlobalState.orderItems = [];
	totalPrice.textContent = "";
	productSearch.value = "";
	orderIdInput.value = "";
	total = 0;
}

function returnOrder(orderId) {
	if (orderId === "") {
		axios
			.post(
				apiEndpoints.returnOrderItemsWithoutOrderNumber,
				GlobalState.orderItems
			)
			.then((response) => {
				console.log("Response:", response.data);
				GlobalState.orderItems.length = 0;
			})
			.catch((error) => console.error("Error:", error));
	} else {
		axios
			.put(
				apiEndpoints.returnOrderItemsById(parseInt(orderId)),
				GlobalState.orderItems
			)
			.then((response) => {
				console.log("Response:", response.data);
				GlobalState.orderItems.length = 0;
			})
			.catch((error) => console.error("Error:", error));
	}
}
