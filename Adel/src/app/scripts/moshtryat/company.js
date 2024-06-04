const axios = require("axios");

const taxRateInput = document.getElementById("taxRateInput");

//getting all product names on page load
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
const companyName = getQueryParam("name");
const companyId = getQueryParam("companyId");
const nameHeader = document.getElementById("nameHeader");
nameHeader.textContent = "اسم الشركة: " + companyName;

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
	if (filteredItems.length > 0) {
		dropdownList.style.display = "block";
	} else {
		dropdownList.style.display = "none";
	}
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

function removeFromGlobal(itemName, unitOfSale) {
	const index = GlobalState.orderItems.findIndex((existingItem) => {
		return (
			existingItem.name === itemName &&
			existingItem.unitOfSaleName === unitOfSale
		);
	});

	if (index > -1) {
		// Item with the same productId found, remove it
		GlobalState.orderItems.splice(index, 1);
	}
}

function updateGlobal(item, unitOfSale, count, unitPrice, salePrice) {
	let orderItem = {
		serialNumber: item.serialNumber,
		name: item.name,
		unitOfSaleName: unitOfSale.name,
		unitPrice: parseInt(unitPrice),
		salePrice: parseInt(salePrice),
		quantity: parseInt(count),
		isTaxable: item.isTaxable,
		numberOfItemsPerUnit: unitOfSale.numberOfItemsPerUnit,
		isMainUnit: unitOfSale.isMainUnit,
	};

	GlobalState.orderItems.push(orderItem);
}

let itemTotal = 0;
let total = 0;
//getting the full product then populating the table using the populate table function based off of the selected unit
function getProduct(query) {
	axios
		.get(
			`https://marketbackend.azurewebsites.net/api/Product/GetProductByName/${query}`
		)
		.then((response) => {
			const product = response.data;
			const unitsOfSale = [];
			product.unitsOfSale.forEach((u) => unitsOfSale.push(u));

			const row = tbody.insertRow();
			var cellDelete = row.insertCell(0);
			const deleteRowButton = document.createElement("button");
			deleteRowButton.textContent = "delete";
			deleteRowButton.addEventListener("click", () => {
				var rowIndex = deleteRowButton.parentNode.parentNode;
				var productId = rowIndex.cells[1].innerText;
				var unitType = rowIndex.cells[5].innerText;
				var removableTotal = rowIndex.cells[2].innerText;
				total -= parseInt(removableTotal);
				totalPrice.textContent = total;
				removeFromGlobal(productId, unitType);
				table.deleteRow(rowIndex.rowIndex);
			});

			cellDelete.appendChild(deleteRowButton);
			var cellTotal = row.insertCell(1);

			var cellNumberOfItemsPerUnit = row.insertCell(2);
			cellNumberOfItemsPerUnit.textContent =
				unitsOfSale[0].numberOfItemsPerUnit;

			var cellIsMainUnit = row.insertCell(3);
			cellIsMainUnit.textContent = unitsOfSale[0].isMainUnit;

			var cellTax = row.insertCell(4);
			if (product.isTaxable) {
				cellTax.textContent = "نعم";
			} else {
				cellTax.textContent = "لا";
			}

			var cellCount = row.insertCell(5);
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
						updateGlobal(
							product,
							selectedUnit,
							countInput.value,
							unitPriceInput.value,
							priceInput.value
						);
						cellType.textContent = dropdown.value;
						dropdown.disabled = true;
						countInput.disabled = true;
						priceInput.disabled = true;
					}
				}
			});
			cellCount.appendChild(countInput);

			var cellPrice = row.insertCell(6);
			const priceInput = document.createElement("input");
			priceInput.value = unitsOfSale[0].salePrice; // Assuming salePrice is available
			cellPrice.appendChild(priceInput);

			var cellUnitPrice = row.insertCell(7);
			const unitPriceInput = document.createElement("input");
			unitPriceInput.value = unitsOfSale[0].unitPrice; // Assuming salePrice is available
			cellUnitPrice.appendChild(unitPriceInput);

			const cellType = row.insertCell(8);
			const dropdown = document.createElement("select");

			// Populate dropdown options dynamically
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
					unitPriceInput.value = selectedUnit.unitPrice;
					cellNumberOfItemsPerUnit.textContent =
						selectedUnit.numberOfItemsPerUnit;
					cellIsMainUnit.textContent = selectedUnit.isMainUnit;
				}
			});

			cellType.appendChild(dropdown);

			const cellName = row.insertCell(9);
			cellName.textContent = product.name;
		})
		.catch((error) => {
			console.error("Error making Axios request:", error);
		});
}

function createPurchase(companyId) {
	console.log(GlobalState.orderItems);
	axios
		.post(
			"https://marketbackend.azurewebsites.net/api/Purchase/CreatePurchase",
			{
				companyId: companyId,
				taxRate: parseFloat(taxRateInput.value),
				purchaseItems: GlobalState.orderItems,
			}
		)
		.then((response) => {
			GlobalState.orderItems.length = 0;
			// Handle success
			console.log("Response:", response.data);
			console.clear();
		})
		.catch((error) => {
			// Handle error
			console.error("Error:", error);
		});
}

payButton.addEventListener("click", () => {
	createPurchase(parseInt(companyId));

	while (tbody.firstChild) {
		tbody.removeChild(tbody.firstChild);
	}
	totalPrice.textContent = "";
	productSearch.value = "";
	itemTotal = 0;
	total = 0;
	GlobalState.orderItems = [];
});

// Initialize a variable to store the scanned barcode
let scannedBarcode = "";

document.addEventListener("keydown", (event) => {
	// Check if the key pressed is a valid barcode character
	if (event.key.length === 1) {
		// Concatenate the scanned digit to the barcode string
		scannedBarcode += event.key;
	} else if (event.key === "Enter") {
		axios
			.get(
				`https://marketbackend.azurewebsites.net/api/Product/GetProductBy?serialNumber=${scannedBarcode}`
			)
			.then((response) => {
				const product = response.data;
				const unitsOfSale = [];
				product.unitsOfSale.forEach((u) => unitsOfSale.push(u));

				const row = tbody.insertRow();
				var cellDelete = row.insertCell(0);
				const deleteRowButton = document.createElement("button");
				deleteRowButton.textContent = "delete";
				deleteRowButton.addEventListener("click", () => {
					var rowIndex = deleteRowButton.parentNode.parentNode;
					var productId = rowIndex.cells[1].innerText;
					var unitType = rowIndex.cells[5].innerText;
					var removableTotal = rowIndex.cells[2].innerText;
					total -= parseInt(removableTotal);
					totalPrice.textContent = total;
					removeFromGlobal(productId, unitType);
					table.deleteRow(rowIndex.rowIndex);
				});

				cellDelete.appendChild(deleteRowButton);
				var cellTotal = row.insertCell(1);

				var cellNumberOfItemsPerUnit = row.insertCell(2);
				cellNumberOfItemsPerUnit.textContent =
					unitsOfSale[0].numberOfItemsPerUnit;

				var cellIsMainUnit = row.insertCell(3);
				cellIsMainUnit.textContent = unitsOfSale[0].isMainUnit;

				var cellTax = row.insertCell(4);
				if (product.isTaxable) {
					cellTax.textContent = "نعم";
				} else {
					cellTax.textContent = "لا";
				}

				var cellCount = row.insertCell(5);
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
							updateGlobal(
								product,
								selectedUnit,
								countInput.value,
								unitPriceInput.value,
								priceInput.value
							);
							cellType.textContent = dropdown.value;
							dropdown.disabled = true;
							countInput.disabled = true;
							priceInput.disabled = true;
							productSearch.value = "";
						}
					}
				});
				cellCount.appendChild(countInput);

				var cellPrice = row.insertCell(6);
				const priceInput = document.createElement("input");
				priceInput.value = unitsOfSale[0].salePrice; // Assuming salePrice is available
				cellPrice.appendChild(priceInput);

				var cellUnitPrice = row.insertCell(7);
				const unitPriceInput = document.createElement("input");
				unitPriceInput.value = unitsOfSale[0].unitPrice; // Assuming salePrice is available
				cellUnitPrice.appendChild(unitPriceInput);

				const cellType = row.insertCell(8);
				const dropdown = document.createElement("select");

				// Populate dropdown options dynamically
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
						unitPriceInput.value = selectedUnit.unitPrice;
						cellNumberOfItemsPerUnit.textContent =
							selectedUnit.numberOfItemsPerUnit;
						cellIsMainUnit.textContent = selectedUnit.isMainUnit;
					}
				});

				cellType.appendChild(dropdown);

				const cellName = row.insertCell(9);
				cellName.textContent = product.name;
			})
			.catch((error) => {
				console.error("Error making Axios request:", error);
			});
		scannedBarcode = "";
	}
});
