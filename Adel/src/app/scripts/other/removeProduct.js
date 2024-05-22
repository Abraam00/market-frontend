const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
	window.history.back();
});

const removeButton = document.getElementById("removeButton");
const productIdInput = document.getElementById("productId");

removeButton.addEventListener("click", () => {
	const productId = parseInt(productIdInput.value);
	axios
		.delete(`https://localhost:7163/api/Product/DeleteProduct/${productId}`)
		.then((response) => {
			alert("Product removed successfully");
			productIdInput.value = "";
		})
		.catch((err) => {
			console.log("request failed", err);
		});
});
