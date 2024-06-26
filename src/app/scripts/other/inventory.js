const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
	window.history.back();
});

const tableContainer = document.getElementById("table-container");
let products;
let currentPage = 1;
const productsPerPage = 10;

// Create and append search bar
const searchBar = document.createElement("input");
searchBar.setAttribute("type", "text");
searchBar.setAttribute("placeholder", "Search by name or product number...");
searchBar.setAttribute("id", "searchBar");
document.body.insertBefore(searchBar, tableContainer);

// Fetch products
axios
	.get("https://marketbackend.azurewebsites.net/api/Product/GetAllProducts")
	.then((response) => {
		products = response.data;

		// Sort products by product ID
		products.sort((a, b) => a.productId - b.productId);

		displayProducts();

		// Filter products as you type
		searchBar.addEventListener("input", filterProducts);
	})
	.catch((error) => {
		console.log(error);
	});

function filterProducts() {
	const query = searchBar.value.toLowerCase();
	const filteredProducts = products.filter(
		(product) =>
			product.name.toLowerCase().includes(query) ||
			product.productId.toString().includes(query)
	);
	displayProducts(filteredProducts);
}

function displayProducts(filteredProducts = products) {
	tableContainer.innerHTML = ""; // Clear previous content

	const startIndex = (currentPage - 1) * productsPerPage;
	const endIndex = startIndex + productsPerPage;
	const productsToShow = filteredProducts.slice(startIndex, endIndex);

	const table = document.createElement("table");
	table.setAttribute("border", "1");

	// Create table header
	const thead = document.createElement("thead");
	const trHead = document.createElement("tr");
	const thProductName = document.createElement("th");
	const thProductId = document.createElement("th");
	const thInfo = document.createElement("th");
	thProductName.textContent = "اسم الصنف";
	thProductId.textContent = "رقم الصنف";
	thInfo.textContent = "كميات";
	trHead.appendChild(thInfo);
	trHead.appendChild(thProductId);
	trHead.appendChild(thProductName);

	thead.appendChild(trHead);
	table.appendChild(thead);

	// Create table body
	const tbody = document.createElement("tbody");
	productsToShow.forEach((product) => {
		const tr = document.createElement("tr");
		const tdProductName = document.createElement("td");
		const tdProductId = document.createElement("td");
		var info = document.createElement("td");
		const unitsOfSale = [];
		product.unitsOfSale.forEach((u) => unitsOfSale.push(u));
		unitsOfSale.forEach((unit) => {
			info.textContent += unit.quantity + " " + unit.name + " --- ";
			tr.appendChild(info);
		});
		tdProductName.textContent = product.name;
		tdProductId.textContent = product.productId;
		tr.appendChild(tdProductId);
		tr.appendChild(tdProductName);
		tbody.appendChild(tr);
	});

	table.appendChild(tbody);
	tableContainer.appendChild(table);

	createPaginationControls(filteredProducts);
}

function createPaginationControls(filteredProducts) {
	const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
	const paginationContainer = document.createElement("div");

	for (let i = 1; i <= totalPages; i++) {
		const button = document.createElement("button");
		button.setAttribute("id", "pageNumber");
		button.textContent = i;
		button.addEventListener("click", () => {
			currentPage = i;
			displayProducts(filteredProducts);
		});
		paginationContainer.appendChild(button);
	}

	tableContainer.appendChild(paginationContainer);
}
