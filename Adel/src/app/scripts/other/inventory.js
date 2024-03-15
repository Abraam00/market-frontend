const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
	window.history.back();
});

const tableContainer = document.getElementById("table-container");
let products;
let currentPage = 1;
const productsPerPage = 3;

axios
	.get("https://localhost:7163/api/Product/GetAllProducts")
	.then((response) => {
		products = response.data;

		// Sort products by product ID
		products.sort((a, b) => a.productId - b.productId);

		displayProducts();

		function displayProducts() {
			tableContainer.innerHTML = ""; // Clear previous content

			const startIndex = (currentPage - 1) * productsPerPage;
			const endIndex = startIndex + productsPerPage;
			const productsToShow = products.slice(startIndex, endIndex);

			const table = document.createElement("table");
			table.setAttribute("border", "1");

			// Create table header
			const thead = document.createElement("thead");
			const trHead = document.createElement("tr");
			const thProductName = document.createElement("th");
			const thProductId = document.createElement("th");
			const thBigBox = document.createElement("th");
			const thBox = document.createElement("th");
			const thIndividual = document.createElement("th");
			thProductName.textContent = "اسم الصنف";
			thProductId.textContent = "رقم الصنف";
			thBigBox.textContent = "كرتونة";
			thBox.textContent = "علبة";
			thIndividual.textContent = "واحدة";
			trHead.appendChild(thIndividual);
			trHead.appendChild(thBox);
			trHead.appendChild(thBigBox);
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
				const tdBigBox = document.createElement("td");
				const tdBox = document.createElement("td");
				const tdIndividual = document.createElement("td");
				const bigBoxUnit = product.unitsOfSale.find(
					(unit) => unit.name === "bigBox"
				);
				const boxUnit = product.unitsOfSale.find((unit) => unit.name === "box");
				const individualUnit = product.unitsOfSale.find(
					(unit) => unit.name === "individual"
				);
				tdBigBox.textContent = bigBoxUnit.quantity;
				tdBox.textContent = boxUnit.quantity;
				tdIndividual.textContent = individualUnit.quantity;
				tdProductName.textContent = product.name;
				tdProductId.textContent = product.productId;

				tr.appendChild(tdIndividual);
				tr.appendChild(tdBox);
				tr.appendChild(tdBigBox);
				tr.appendChild(tdProductId);
				tr.appendChild(tdProductName);
				tbody.appendChild(tr);
			});

			table.appendChild(tbody);
			tableContainer.appendChild(table);

			createPaginationControls();
		}

		function createPaginationControls() {
			const totalPages = Math.ceil(products.length / productsPerPage);
			const paginationContainer = document.createElement("div");

			for (let i = 1; i <= totalPages; i++) {
				const button = document.createElement("button");
				button.textContent = i;
				button.addEventListener("click", () => {
					currentPage = i;
					displayProducts();
				});
				paginationContainer.appendChild(button);
			}

			tableContainer.appendChild(paginationContainer);
		}
	})
	.catch((error) => {
		console.log(error);
	});
