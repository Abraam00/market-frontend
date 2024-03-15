const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
	window.history.back();
});
const productId = document.getElementById("productId");
const name = document.getElementById("name");
const unit = document.getElementById("unit");
const unitPrice = document.getElementById("unit price");
const salePrice = document.getElementById("sale price");
const count = document.getElementById("count");
const tax = document.getElementById("tax");

function updateProduct() {
	var isYes = tax.value === "yes";
	const productData = {
		name: name.value,
		unitPrice: parseInt(unitPrice.value),
		salePrice: parseInt(salePrice.value),
		quantity: parseInt(count.value),
		isTaxable: isYes,
		unitOfSaleName: unit.value,
	};

	axios
		.put(
			`https://localhost:7163/api/Product/UpdateProduct?productId=${parseInt(
				productId.value
			)}`,
			productData
		)
		.then((response) => {
			console.log("product saved successfully:", response.data);
			// Handle success
		})
		.catch((error) => {
			console.error("Error saving product:", error);
			// Handle error
		});

	productId.value = "";
	name.value = "";
	unit.value = "";
	unitPrice.value = "";
	salePrice.value = "";
	count.value = "";
}

document
	.getElementById("saveButton")
	.addEventListener("click", () => updateProduct());
