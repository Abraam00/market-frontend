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

function createProduct() {
	var isTaxYes = tax.value === "yes";
	var isMainUnitYes = isMainUnit.value === "yes";
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
			console.log("product saved successfully:", response.data);
			// Handle success
		})
		.catch((error) => {
			console.error("Error saving product:", error);
			console.log(productData);
			// Handle error
		});

	serialNumber.value = "";
	name.value = "";
	unit.value = "";
	unitPrice.value = "";
	salePrice.value = "";
	count.value = "";
	numberOfItemsPerUnit.value = "";
}

document
	.getElementById("saveButton")
	.addEventListener("click", () => createProduct());
