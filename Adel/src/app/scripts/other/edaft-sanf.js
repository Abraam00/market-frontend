const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
	window.history.back();
});

const serialNumber = document.getElementById("serial number");
const name = document.getElementById("name");
const unit = document.getElementById("unit");
const unitPrice = document.getElementById("unit price");
const salePrice = document.getElementById("sale price");
const count = document.getElementById("count");
const tax = document.getElementById("tax");
const isMainUnit = document.getElementById("isMainUnit");
const numberOfItemsPerUnit = document.getElementById("numberOfItemsPerUnit");
const addButton = document.getElementById("insertButton");
const saveButton = document.getElementById("saveButton");

let unitOfSaleDataArray = []; // Array to store unit of sale data

addButton.addEventListener("click", () => {
	const container = document.getElementById("inputsContainer");

	const wrapper = document.createElement("div");
	wrapper.classList.add("input-wrapper");

	const line = document.createElement("div");
	line.className = "line";
	wrapper.appendChild(line);

	const addedUnitOfSale = document.createElement("input");
	addedUnitOfSale.type = "text";
	addedUnitOfSale.placeholder = "unit of sale name";
	wrapper.appendChild(addedUnitOfSale);

	const addedUnitPrice = document.createElement("input");
	addedUnitPrice.type = "text";
	addedUnitPrice.placeholder = "unit price";
	wrapper.appendChild(addedUnitPrice);

	const addedSalePrice = document.createElement("input");
	addedSalePrice.type = "text";
	addedSalePrice.placeholder = "sale price";
	wrapper.appendChild(addedSalePrice);

	const addedQuantity = document.createElement("input");
	addedQuantity.type = "text";
	addedQuantity.placeholder = "quantity";
	wrapper.appendChild(addedQuantity);

	const addedIsMainUnit = document.createElement("select");
	const option1 = document.createElement("option");
	option1.text = "نعم";
	option1.value = "yes";
	const option2 = document.createElement("option");
	option2.text = "لا";
	option2.value = "no";
	addedIsMainUnit.appendChild(option1);
	addedIsMainUnit.appendChild(option2);
	wrapper.appendChild(addedIsMainUnit);

	const addedQuantityPerUnit = document.createElement("input");
	addedQuantityPerUnit.type = "text";
	addedQuantityPerUnit.placeholder = "quantity per unit";
	wrapper.appendChild(addedQuantityPerUnit);

	container.appendChild(wrapper);
});

function createProduct() {
	const isTaxYes = tax.value === "yes";
	const isMainUnitYes = isMainUnit.value === "yes";

	const productData = {
		serialNumber: serialNumber.value,
		name: name.value,
		unitOfSaleName: unit.value,
		unitPrice: parseInt(unitPrice.value),
		salePrice: parseInt(salePrice.value),
		quantity: parseInt(count.value),
		isTaxable: isTaxYes,
		isMainUnit: isMainUnitYes,
		numberOfItemsPerUnit: parseInt(numberOfItemsPerUnit.value),
	};

	axios
		.post("https://localhost:7163/api/Product/CreateProduct", productData)
		.then((response) => {
			console.log("Product saved successfully:", response.data);

			unitOfSaleDataArray.forEach((unitOfSaleData, index) => {
				const productId = response.data.productId;
				const unitOfSaleDataToSend = {
					name: name.value,
					unitPrice: parseInt(unitOfSaleData.unitPrice),
					salePrice: parseInt(unitOfSaleData.salePrice),
					quantity: parseInt(unitOfSaleData.quantity),
					isTaxable: isTaxYes,
					unitOfSaleName: unitOfSaleData.name,
					isMainUnit: false,
					numberOfItemsPerUnit: parseInt(unitOfSaleData.numberOfItemsPerUnit),
				};

				axios
					.put(
						`https://localhost:7163/api/Product/UpdateProduct?productId=${productId}`,
						unitOfSaleDataToSend
					)
					.then((response) => {
						console.log("Unit of sale saved successfully:", response.data);
					})
					.catch((error) => {
						console.error("Error saving unit of sale:", error);
						// Handle error
					});
			});
		})
		.catch((error) => {
			console.error("Error saving product:", error);
			// Handle error
		});

	// Clear product input fields
	serialNumber.value = "";
	name.value = "";
	unit.value = "";
	unitPrice.value = "";
	salePrice.value = "";
	count.value = "";
	numberOfItemsPerUnit.value = "";
}

// Event listener for the Save button
saveButton.addEventListener("click", () => {
	createProduct();
});

// Event listener for the Add button
addButton.addEventListener("click", () => {
	const addedUnitOfSale = document.querySelector(
		'input[placeholder="unit of sale name"]'
	);
	const addedUnitPrice = document.querySelector(
		'input[placeholder="unit price"]'
	);
	const addedSalePrice = document.querySelector(
		'input[placeholder="sale price"]'
	);
	const addedQuantity = document.querySelector('input[placeholder="quantity"]');
	const addedIsMainUnit = document.querySelector("select");
	const addedQuantityPerUnit = document.querySelector(
		'input[placeholder="quantity per unit"]'
	);

	// Add unit of sale data to array
	unitOfSaleDataArray.push({
		name: name.value,
		unitPrice: parseInt(addedUnitPrice.value),
		salePrice: parseInt(addedSalePrice.value),
		quantity: parseInt(addedQuantity.value),
		isTaxable: isTaxYes,
		unitOfSaleName: addedUnitOfSale.value,
		isMainUnit: false,
		numberOfItemsPerUnit: parseInt(addedQuantityPerUnit),
	});
});
