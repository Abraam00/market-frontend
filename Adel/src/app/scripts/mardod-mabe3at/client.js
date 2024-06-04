const axios = require("axios");

// Getting all product names on page load
let productNames;
axios
	.get(
		"https://marketbackend.azurewebsites.net/api/Product/GetAllProductsNames"
	)
	.then((response) => {
		productNames = response.data;
	})
	.catch((error) => {
		console.error("Error fetching data:", error);
	});

document.getElementById("backButton").addEventListener("click", () => {
	window.history.back();
});

// Function to get the query parameter from the URL
function getQueryParam(param) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param);
}

// Get the name query parameter from the URL
const name = getQueryParam("name");
const customerId = getQueryParam("customerId");
const customerNumber = getQueryParam("customerNumber");
const nameHeader = document.getElementById("nameHeader");
const madyonya = document.getElementById("madyonya");
nameHeader.textContent = "اسم العميل: " + name;

let customer;
let moneyRemaining;
axios
	.get(
		`https://marketbackend.azurewebsites.net/api/Customer/GetCustomer?customerNumber=${customerNumber}`
	)
	.then((response) => {
		customer = response.data;
		moneyRemaining = customer.moneyRemaining;
		madyonya.textContent = moneyRemaining;
	})
	.catch((error) => {
		console.error("Error fetching data:", error);
	});

const productSearch = document.getElementById("searchInput");
productSearch.addEventListener("input", updateDropdown);

function updateDropdown() {
	const searchTerm = productSearch.value.toLowerCase();
	const filteredItems = productNames.filter((item) =>
		item.toLowerCase().includes(searchTerm)
	);

	// Clear previous list items
	dropdownList.innerHTML = "";

	// Add filtered items to the dropdown
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

	// Show or hide the dropdown based on the number of filtered items
	dropdownList.style.display = filteredItems.length > 0 ? "block" : "none";
}

// Close the dropdown when clicking outside the input or list
document.addEventListener("click", (event) => {
	if (
		!event.target.matches("#searchInput") &&
		!event.target.matches("#dropdownList li")
	) {
		dropdownList.style.display = "none";
	}
});

const GlobalState = {
	orderItems: [],
};

const table = document.querySelector("table");
const tbody = table.querySelector("tbody");
const totalPrice = document.getElementById("total");
const payButton = document.getElementById("payButton");
const paidAmount = document.getElementById("payInput");

function removeFromGlobal(productId, unitOfSale) {
	const index = GlobalState.orderItems.findIndex((existingItem) => {
		return (
			existingItem.productId === parseInt(productId) &&
			existingItem.unitType === unitOfSale
		);
	});

	if (index > -1) {
		GlobalState.orderItems.splice(index, 1);
	}
}

function updateGlobal(item, unitOfSale, count, salePrice) {
	let orderItem = {
		productId: item.productId,
		quantity: parseInt(count),
		unitType: unitOfSale.name,
		salePrice: parseInt(salePrice),
	};
	GlobalState.orderItems.push(orderItem);
}

let itemTotal = 0;
let total = 0;

// Getting the full product then populating the table using the populate table function based off of the selected unit
function getProduct(query) {
	axios
		.get(
			`https://marketbackend.azurewebsites.net/api/Product/GetProductByName/${query}`
		)
		.then((response) => {
			const product = response.data;
			const unitsOfSale = product.unitsOfSale;

			const row = tbody.insertRow();
			const cellDelete = row.insertCell(0);
			const deleteRowButton = document.createElement("button");
			deleteRowButton.textContent = "delete";
			deleteRowButton.addEventListener("click", () => {
				const rowIndex = deleteRowButton.parentNode.parentNode;
				const productId = rowIndex.cells[1].innerText;
				const unitType = rowIndex.cells[5].innerText;
				const removableTotal = rowIndex.cells[2].innerText;
				total -= parseInt(removableTotal);
				totalPrice.textContent = total;
				removeFromGlobal(productId, unitType);
				table.deleteRow(rowIndex.rowIndex);
			});

			cellDelete.appendChild(deleteRowButton);
			const cellProductId = row.insertCell(1);
			cellProductId.textContent = product.productId;
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
				priceInput,
				cellType
			);

			cellCount.appendChild(countInput);
			cellPrice.appendChild(priceInput);
			cellType.appendChild(dropdown);
			cellName.textContent = product.name;
		})
		.catch((error) => {
			console.error("Error making Axios request:", error);
		});
}

function createCountInput(
	row,
	unitsOfSale,
	product,
	cellTotal,
	dropdown,
	priceInput,
	cellType
) {
	const countInput = document.createElement("input");
	countInput.addEventListener("keyup", (event) => {
		if (event.key === "Enter") {
			cellTotal.textContent =
				parseInt(countInput.value) * parseInt(priceInput.value);
			itemTotal = parseInt(cellTotal.textContent);
			if (isNaN(total)) {
				total = 0;
			}
			total += itemTotal;
			totalPrice.textContent = total;
			const selectedUnit = unitsOfSale.find(
				(unit) => unit.name === dropdown.value
			);
			if (selectedUnit) {
				const quantity = selectedUnit.quantity;
				const unitPrice = selectedUnit.unitPrice;

				if (parseInt(priceInput.value) < unitPrice) {
					priceInput.value = unitPrice;
				}
				total -= itemTotal;
				cellTotal.textContent =
					parseInt(countInput.value) * parseInt(priceInput.value);
				itemTotal = parseInt(cellTotal.textContent);
				total += itemTotal;
				totalPrice.textContent = total;
				updateGlobal(product, selectedUnit, countInput.value, priceInput.value);
				cellType.textContent = dropdown.value;
				dropdown.disabled = true;
				countInput.disabled = true;
				priceInput.disabled = true;
				productSearch.value = "";
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
		if (selectedUnit) {
			priceInput.value = selectedUnit.salePrice;
		}
	});

	return dropdown;
}

function updateCustomer(name, customerNumber, moneyRemaining) {
	axios.put(
		`https://marketbackend.azurewebsites.net/api/Customer/UpdateCustomer/${customerId}`,
		{
			name: name,
			customerNumber: customerNumber,
			moneyRemaining: moneyRemaining,
		}
	);
}

const orderIdInput = document.getElementById("orderIdInput");
payButton.addEventListener("click", () => {
	let moneyRemaining =
		parseInt(madyonya.textContent) - parseInt(totalPrice.textContent);
	let moneyBack;
	if (moneyRemaining < 0) {
		alert("money to give back: " + -moneyRemaining);
		madyonya.textContent = moneyRemaining = 0;
	} else {
		alert("money to give back: " + totalPrice.textContent);
	}
	returnOrder(orderIdInput.value);
	updateCustomer(name, customerNumber, moneyRemaining);

	while (tbody.firstChild) {
		tbody.removeChild(tbody.firstChild);
	}
	GlobalState.orderItems = [];
	totalPrice.textContent = "";
	productSearch.value = "";
	orderIdInput.value = "";
	itemTotal = 0;
	total = 0;
});

function returnOrder(orderId) {
	if (orderId === "") {
		axios
			.post(
				"https://marketbackend.azurewebsites.net/api/Order/returnOrderItemsWithoutOrderNumber",
				GlobalState.orderItems
			)
			.then((response) => {
				GlobalState.orderItems.length = 0;
				console.log("Response:", response.data);
				console.clear();
				printReceiptWithConfirmation(response.data);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	} else {
		let id = parseInt(orderId);
		axios
			.put(
				`https://marketbackend.azurewebsites.net/api/Order/returnOrderItems/${id}`,
				GlobalState.orderItems
			)
			.then((response) => {
				GlobalState.orderItems.length = 0;
				console.log("Response:", response.data);
				console.clear();
				printReceiptWithConfirmation(response.data);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}
}

// Initialize a variable to store the scanned barcode
let scannedBarcode = "";

document.addEventListener("keydown", (event) => {
	// Check if the key pressed is a valid barcode character
	if (event.key.length === 1) {
		scannedBarcode += event.key;
	} else if (event.key === "Enter") {
		axios
			.get(
				`https://marketbackend.azurewebsites.net/api/Product/GetProductBy?serialNumber=${scannedBarcode}`
			)
			.then((response) => {
				const product = response.data;
				const unitsOfSale = product.unitsOfSale;

				const row = tbody.insertRow();
				const cellDelete = row.insertCell(0);
				const deleteRowButton = document.createElement("button");
				deleteRowButton.textContent = "delete";
				deleteRowButton.addEventListener("click", () => {
					const rowIndex = deleteRowButton.parentNode.parentNode;
					const productId = rowIndex.cells[1].innerText;
					const unitType = rowIndex.cells[5].innerText;
					const removableTotal = rowIndex.cells[2].innerText;
					total -= parseInt(removableTotal);
					totalPrice.textContent = total;
					removeFromGlobal(productId, unitType);
					table.deleteRow(rowIndex.rowIndex);
				});

				cellDelete.appendChild(deleteRowButton);
				const cellProductId = row.insertCell(1);
				cellProductId.textContent = product.productId;
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
					priceInput,
					cellType
				);

				cellCount.appendChild(countInput);
				cellPrice.appendChild(priceInput);
				cellType.appendChild(dropdown);
				cellName.textContent = product.name;
			})
			.catch((error) => {
				console.error("Error making Axios request:", error);
			});
		scannedBarcode = "";
	}
});
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
