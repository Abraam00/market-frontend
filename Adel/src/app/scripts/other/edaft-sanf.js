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
const container = document.getElementById("inputsContainer");
let unitSetCount = 0;

function createUnitSet() {
	unitSetCount++;
	const unitSet = document.createElement("div");
	unitSet.id = `unitSet${unitSetCount}`;

	unitSet.innerHTML = `
		<hr style="border: 1px solid black;">
        <input type="text" id="unit${unitSetCount}" placeholder="Unit">
        <input type="text" id="unitPrice${unitSetCount}" placeholder="Unit Price">
        <input type="text" id="salePrice${unitSetCount}" placeholder="Sale Price">
        <input type="text" id="quantity${unitSetCount}" placeholder="Quantity">
        <input type="text" id="numberOfItemsPerUnit${unitSetCount}" placeholder="Number of Items per Unit">
        <label for="isMainUnit${unitSetCount}">Is Main Unit:</label>
            <select id="isMainUnit${unitSetCount}">
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
            <label for="isTaxable${unitSetCount}">Is Taxable:</label>
            <select id="isTaxable${unitSetCount}">
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
		<hr style="border: 1px solid black;">
    `;

	container.appendChild(unitSet);
}
addButton.addEventListener("click", createUnitSet);

function getUnitSetData(setIndex, name) {
	const unitOfSaleName = document.getElementById(`unit${setIndex}`).value;
	const unitPrice = parseInt(
		document.getElementById(`unitPrice${setIndex}`).value
	);
	const salePrice = parseInt(
		document.getElementById(`salePrice${setIndex}`).value
	);
	const quantity = parseInt(
		document.getElementById(`quantity${setIndex}`).value
	);
	const numberOfItemsPerUnit = parseInt(
		document.getElementById(`numberOfItemsPerUnit${setIndex}`).value
	);
	const isMainUnit =
		document.getElementById(`isMainUnit${setIndex}`).value === "yes";
	const isTaxable =
		document.getElementById(`isTaxable${setIndex}`).value === "yes";

	return {
		name,
		unitOfSaleName,
		unitPrice,
		salePrice,
		quantity,
		numberOfItemsPerUnit,
		isMainUnit,
		isTaxable,
	};
}

function clearUnitSetFields(setIndex) {
	document.getElementById(`unit${setIndex}`).value = "";
	document.getElementById(`unitPrice${setIndex}`).value = "";
	document.getElementById(`salePrice${setIndex}`).value = "";
	document.getElementById(`quantity${setIndex}`).value = "";
	document.getElementById(`numberOfItemsPerUnit${setIndex}`).value = "";
	document.getElementById(`isMainUnit${setIndex}`).value = "yes";
	document.getElementById(`isTaxable${setIndex}`).value = "yes";
}

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

	const productName = name.value;
	axios
		.post(
			"https://marketbackend.azurewebsites.net/api/Product/CreateProduct",
			productData
		)
		.then((response) => {
			console.log("Product saved successfully:", response.data);
			for (let i = 1; i <= unitSetCount; i++) {
				const unitData = getUnitSetData(i, productName);

				axios
					.put(
						`https://marketbackend.azurewebsites.net/api/Product/UpdateProduct?productId=${parseInt(
							response.data.productId
						)}`,
						unitData
					)
					.then((response) => {
						console.log(`Product ${i} saved successfully:`, response.data);
						clearUnitSetFields(i);
					})
					.catch((error) => {
						console.error(`Error saving product ${i}:`, error);
					});
			}
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

let scannedBarcode = "";

document.addEventListener("keydown", (event) => {
	// Check if the key pressed is a valid barcode character
	if (event.key.length === 1) {
		// Concatenate the scanned digit to the barcode string
		scannedBarcode += event.key;
	} else if (event.key === "Enter") {
		serialNumber.value = scannedBarcode;
	}
});
