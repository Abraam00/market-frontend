const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
	window.history.back();
});

// Get the button container element
const buttonContainer = document.getElementById("buttonContainer");

let companies;
axios
	.get("https://localhost:7163/api/Company/GetCompanies")
	.then((response) => {
		companies = response.data;
		// Create buttons dynamically based on the names
		renderButtons(companies);

		// Add event listener to search input
		const searchInput = document.getElementById("search");
		searchInput.addEventListener("input", () => {
			const searchTerm = searchInput.value.toLowerCase();
			const filteredCompanies = companies.filter(
				(company) =>
					company.companyName.toLowerCase().includes(searchTerm) ||
					company.companyId.toLowerCase().includes(searchTerm)
			);
			renderButtons(filteredCompanies);
		});
	})
	.catch((error) => {
		console.error("Error fetching data:", error);
	});

function renderButtons(companiesToRender) {
	// Clear existing buttons
	buttonContainer.innerHTML = "";

	// Create buttons based on the provided companys
	companiesToRender.forEach((company) => {
		const button = document.createElement("button");
		button.className = "big-button";
		button.textContent = company.companyName + "-" + company.companyId;

		button.addEventListener("click", () => {
			// Construct the URL with the name as a query parameter
			const url = `company.html?name=${encodeURIComponent(
				company.companyName
			)}&companyId=${encodeURIComponent(
				company.companyId
			)}&companyNumber=${encodeURIComponent(company.companyNumber)}`;

			window.location.href = url;
		});

		buttonContainer.appendChild(button);
	});
}
