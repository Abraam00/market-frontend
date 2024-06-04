const axios = require("axios");

const table = document.querySelector("table");
const tbody = table.querySelector("tbody");
const totalPrice = document.getElementById("total");
const payButton = document.getElementById("payButton");
const paidAmount = document.getElementById("payInput");
const taxRateInput = document.getElementById("taxRateInput");
const productSearch = document.getElementById("searchInput");
const GlobalState = { orderItems: [] };
let productNames = [];
let itemTotal = 0;
let total = 0;
let scannedBarcode = "";

const apiEndpoints = {
	getAllProductNames:
		"https://marketbackend.azurewebsites.net/api/Product/GetAllProductsNames",
	getProductByName: (query) =>
		`https://marketbackend.azurewebsites.net/api/Product/GetProductByName/${query}`,
	getProductBySerial: (serial) =>
		`https://marketbackend.azurewebsites.net/api/Product/GetProductBy?serialNumber=${serial}`,
	createOrder: "https://marketbackend.azurewebsites.net/api/Order/CreateOrder",
};

// Fetch product names on page load
axios
	.get(apiEndpoints.getAllProductNames)
	.then((response) => (productNames = response.data))
	.catch((error) => console.error("Error fetching data:", error));

document
	.getElementById("backButton")
	.addEventListener("click", () => window.history.back());
document
	.getElementById("agelButton")
	.addEventListener("click", () => (window.location.href = "agel.html"));
document.getElementById("nameHeader").textContent = "اسم العامل: " + "جلجل";

productSearch.addEventListener("input", updateDropdown);
document.addEventListener("click", closeDropdownOnClickOutside);
payButton.addEventListener("click", handlePayment);
document.addEventListener("keydown", handleBarcodeInput);

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
	if (parseInt(paidAmount.value) >= parseInt(totalPrice.textContent)) {
		alert(
			"money to give back: " +
				(parseInt(paidAmount.value) - parseInt(totalPrice.textContent))
		);
		createOrder(parseInt(paidAmount.value));
		resetOrder();
	} else {
		alert("paid amount is less than total");
	}
}

function resetOrder() {
	while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
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
		removeProductFromTable(row);
		removeFromGlobal(product.productId, dropdown.value);
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
				productSearch.value = "";
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

function removeProductFromTable(row) {
	const rowIndex = row.rowIndex;
	const removableTotal = parseInt(row.cells[2].innerText);
	total -= removableTotal;
	totalPrice.textContent = total;
	table.deleteRow(rowIndex);
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

function createOrder(moneyPaid) {
	axios
		.post(apiEndpoints.createOrder, {
			customerId: null,
			orderItems: GlobalState.orderItems,
			paymentType: "cash",
			moneyPaid: moneyPaid,
			orderNumber: "",
			taxRate: taxRateInput.value,
		})
		.then((response) => {
			GlobalState.orderItems.length = 0;
			console.log("Response:", response.data);
			console.clear();

			// Print receipt
			printReceiptWithConfirmation(response.data);
		})
		.catch((error) => {
			console.error("Error creating order:", error);
			console.clear();
		});
}
function printReceiptWithConfirmation(orderData) {
	const printConfirmation = window.confirm("عايز تطبع فاتورة؟");
	if (printConfirmation) {
		printReceipt(orderData);
	}
}

function printReceipt(orderData) {
	const receiptWindow = window.open("", "_blank");

	const receiptContent = `
        <html>
            <head>
                <title>Receipt</title>
                <style>
                    /* Add your receipt styles here */
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 8px;
                    }
                </style>
            </head>
            <body>
                <h2>Receipt</h2>
                <p>Order Number: ${orderData.orderId}</p>
                <p>Date: ${new Date().toLocaleString()}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderData.orderItems
													.map(
														(item) => `
                            <tr>
                                <td>${item.productName}</td>
                                <td>${item.priceAfterTax}</td>
                                <td>${item.quantity}</td>
                                <td>${item.priceAfterTax * item.quantity}</td>
                            </tr>
                        `
													)
													.join("")}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3">Tax (${orderData.taxRate}%)</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="3">Total</td>
                            <td>${orderData.total}</td>
                        </tr>
                    </tfoot>
                </table>
            </body>
        </html>
    `;

	receiptWindow.document.write(receiptContent);
	receiptWindow.document.close();
	receiptWindow.print();
}
