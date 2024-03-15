const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
	window.history.back();
});

function saveCustomer() {
	const companyName = document.getElementById("customerName");
	const companyNumber = document.getElementById("customerNumber");

	const customerData = {
		companyName: companyName.value,
		companyNumber: companyNumber.value,
	};

	axios
		.post("https://localhost:7163/api/Company/CreateCompany", customerData)
		.then((response) => {
			console.log("Customer saved successfully:", response.data);
			// Handle success
		})
		.catch((error) => {
			console.error("Error saving customer:", error);
			// Handle error
		});
	companyName.value = "";
	companyNumber.value = "";
}

document
	.getElementById("saveButton")
	.addEventListener("click", () => saveCustomer());
