const axios = require("axios");
document.getElementById("backButton").addEventListener("click", () => {
	window.history.back();
});
// Get the button container element
const buttonContainer = document.getElementById("buttonContainer");

let customers;

axios
	.get("https://marketbackend.azurewebsites.net/api/Customer/GetAllCustomers")
	.then((response) => {
		customers = response.data;
		// Create buttons dynamically based on the names
		renderButtons(customers);

		// Add event listener to search input
		const searchInput = document.getElementById("search");
		searchInput.addEventListener("input", () => {
			const searchTerm = searchInput.value.toLowerCase();
			const filteredCustomers = customers.filter(
				(customer) =>
					customer.name.toLowerCase().includes(searchTerm) ||
					customer.customerId.toLowerCase().includes(searchTerm)
			);
			renderButtons(filteredCustomers);
		});
	})
	.catch((error) => {
		console.error("Error fetching data:", error);
	});

function renderButtons(customersToRender) {
	// Clear existing buttons
	buttonContainer.innerHTML = "";

	// Create buttons based on the provided customers
	customersToRender.forEach((customer) => {
		const button = document.createElement("button");
		button.className = "big-button";
		button.textContent = customer.name + "-" + customer.customerId;

		button.addEventListener("click", () => {
			// Construct the URL with the name as a query parameter
			const url = `clientHistory.html?name=${encodeURIComponent(
				customer.name
			)}&customerId=${encodeURIComponent(
				customer.customerId
			)}&customerNumber=${encodeURIComponent(customer.customerNumber)}`;

			window.location.href = url;
		});

		buttonContainer.appendChild(button);
	});
}
