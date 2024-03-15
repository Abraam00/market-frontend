const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
	window.history.back();
});

const tableContainer = document.getElementById("table-container");
let purchases;
let currentPage = 1;
const purchasesPerPage = 5; // Change this value to adjust the number of purchases per page

axios
	.get("https://localhost:7163/api/Purchase/GetAllPurchasesWithTaxableProducts")
	.then((response) => {
		purchases = response.data;

		displayPurchases();

		// Function to display purchases based on the current page
		function displayPurchases() {
			// Clear previous content
			tableContainer.innerHTML = "";

			const startIndex = (currentPage - 1) * purchasesPerPage;
			const endIndex = startIndex + purchasesPerPage;
			const purchasesToShow = purchases.slice(startIndex, endIndex);
			purchasesToShow.forEach((purchase) => {
				const table = document.createElement("table");
				table.setAttribute("border", "1");
				const thead = document.createElement("thead");
				const trHead = document.createElement("tr");
				const thName = document.createElement("th");
				const thUnitType = document.createElement("th");
				const thUnitPrice = document.createElement("th");
				const thQuantity = document.createElement("th");
				const thTaxRate = document.createElement("th");
				const thPriceAfterTax = document.createElement("th");
				const thTotal = document.createElement("th");
				const thDate = document.createElement("th");
				thName.textContent = "الاسم";
				thDate.textContent = "التاريخ";
				thUnitType.textContent = "الوحدة";
				thUnitPrice.textContent = "السعر";
				thQuantity.textContent = "العدد";
				thTotal.textContent = "المجموع";
				thTaxRate.textContent = "الضريبة المضافة";
				thPriceAfterTax.textContent = "السعر بعد الضريبة المضافة";
				trHead.appendChild(thTotal);
				trHead.appendChild(thQuantity);
				trHead.appendChild(thPriceAfterTax);
				trHead.appendChild(thTaxRate);
				trHead.appendChild(thUnitPrice);
				trHead.appendChild(thUnitType);
				trHead.appendChild(thDate);
				trHead.appendChild(thName);
				thead.appendChild(trHead);
				table.appendChild(thead);
				const tbody = document.createElement("tbody");
				// Iterate over order properties to create table cells
				purchase.purchaseItems.forEach((item) => {
					const trBody = document.createElement("tr");
					const tdName = document.createElement("td");
					const tdDate = document.createElement("td");
					const tdUnitType = document.createElement("td");
					const tdUnitPrice = document.createElement("td");
					const tdQuantity = document.createElement("td");
					const tdTaxRate = document.createElement("td");
					const tdPriceAfterTax = document.createElement("td");
					const tdTotal = document.createElement("td");
					tdName.textContent = item.productName;
					tdDate.textContent = formatDate(purchase.purchaseDate);
					tdUnitType.textContent = item.unitType;
					tdUnitPrice.textContent = item.unitPrice;
					tdQuantity.textContent = item.quantity;
					if (item.isTaxable) {
						tdTaxRate.textContent = purchase.taxRate;
						tdPriceAfterTax.textContent =
							item.unitPrice + item.unitPrice * purchase.taxRate;
					} else {
						tdTaxRate.textContent = "0";
						tdPriceAfterTax.textContent = item.unitPrice;
					}

					tdTotal.textContent = item.priceAfterTax;

					trBody.appendChild(tdTotal);
					trBody.appendChild(tdQuantity);
					trBody.appendChild(tdPriceAfterTax);
					trBody.appendChild(tdTaxRate);
					trBody.appendChild(tdUnitPrice);
					trBody.appendChild(tdUnitType);
					trBody.appendChild(tdDate);
					trBody.appendChild(tdName);
					tbody.appendChild(trBody);
				});

				table.appendChild(tbody);
				if (purchase.companyName != null) {
					const nameLabel = document.createElement("h2");
					nameLabel.textContent = purchase.companyName;
					nameLabel.id = "labels";
					tableContainer.appendChild(nameLabel);
				}
				tableContainer.appendChild(table);
			});
			createPaginationControls();
		}
		// Function to create pagination controls
		function createPaginationControls() {
			const totalPages = Math.ceil(purchases.length / purchasesPerPage);
			const paginationContainer = document.createElement("div");

			for (let i = 1; i <= totalPages; i++) {
				const button = document.createElement("button");
				button.textContent = i;
				button.addEventListener("click", () => {
					currentPage = i;
					displayPurchases();
				});
				paginationContainer.appendChild(button);
			}

			tableContainer.appendChild(paginationContainer);
		}
	})
	.catch((error) => {
		console.log(error);
	});

function formatDate(inputDate) {
	const dateObject = new Date(inputDate);

	const day = String(dateObject.getDate()).padStart(2, "0");
	const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are zero-based
	const year = dateObject.getFullYear();

	const hour = String(dateObject.getHours()).padStart(2, "0");
	const minute = String(dateObject.getMinutes()).padStart(2, "0");

	const formattedDate = day + "/" + month + "/" + year;
	const formattedTime = hour + ":" + minute;

	return formattedDate + " " + formattedTime;
}
