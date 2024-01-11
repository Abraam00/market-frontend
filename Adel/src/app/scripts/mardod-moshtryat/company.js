const axios = require("axios");

//getting all product names on page load
let productNames;
axios
  .get("https://localhost:7163/api/Product/GetAllProductsNames")
  .then((response) => {
    productNames = response.data;
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});

// Function to get the query parameter from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Get the name query parameter from the URL
const companyName = getQueryParam("name");
const companyId = getQueryParam("companyId");
const nameHeader = document.getElementById("nameHeader");
nameHeader.textContent = "اسم الشركة: " + companyName;
const orderIdInput = document.getElementById("orderIdInput");

const productSearch = document.getElementById("searchInput");
productSearch.addEventListener("input", updateDropdown);

function updateDropdown() {
  const searchTerm = productSearch.value.toLowerCase();
  const filteredItems = productNames.filter((item) =>
    item.toLowerCase().includes(searchTerm)
  );

  // Clear previous list items
  dropdownList.innerHTML = "";

  // Add filtered items to the dropdown
  filteredItems.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.addEventListener("click", () => {
      productSearch.value = item;
      dropdownList.style.display = "none";
    });
    dropdownList.appendChild(li);
  });

  // Show or hide the dropdown based on the number of filtered items
  if (filteredItems.length > 0) {
    dropdownList.style.display = "block";
  } else {
    dropdownList.style.display = "none";
  }
}

// Close the dropdown when clicking outside the input or list
document.addEventListener("click", (event) => {
  if (
    !event.target.matches("#searchInput") &&
    !event.target.matches("#dropdownList li")
  ) {
    dropdownList.style.display = "none";
  }
});

const GlobalState = {
  orderItems: [],
};

const unitButton = document.getElementById("unitButton");
unitButton.addEventListener("click", () => {
  getProduct(productSearch.value);
});

//having only one checkbox checked at a time
const checkboxes = document.querySelectorAll('input[name="checkboxGroup"]');
let checkboxId;
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("click", function () {
    checkboxes.forEach((otherCheckbox) => {
      if (otherCheckbox !== checkbox) {
        otherCheckbox.checked = false;
      }
      checkboxId = checkbox.id;
    });
  });
});

const table = document.querySelector("table");
const tbody = table.querySelector("tbody");
const totalPrice = document.getElementById("total");
const countInput = document.getElementById("countInput");
const payButton = document.getElementById("payButton");

let total = 0;
let itemTotal = 0;
//method to add the info to the table
function populateTable(item, unitPrice) {
  const row = tbody.insertRow();
  itemTotal = parseInt(countInput.value, 10) * unitPrice;

  const cellTotal = row.insertCell(0);
  cellTotal.textContent = itemTotal;

  const cellCount = row.insertCell(1);
  cellCount.textContent = countInput.value;

  const cellType = row.insertCell(2);
  cellType.textContent = checkboxId;

  const cellPrice = row.insertCell(3);
  cellPrice.textContent = unitPrice;

  const cellName = row.insertCell(4);
  cellName.textContent = item.name;

  total += itemTotal;
  totalPrice.textContent = total;
}

function updateGlobal(item, unitOfSale) {
  let orderItem = {
    productId: item.productId,
    productName: item.name,
    quantity: parseInt(countInput.value),
    unitPrice: unitOfSale.unitPrice,
    unitType: unitOfSale.name,
  };
  GlobalState.orderItems.push(orderItem);
}

//getting the full product then populating the table using the populate table function based off of the selected unit
function getProduct(query) {
  axios
    .get(`https://localhost:7163/api/Product/GetProductByName/${query}`)
    .then((response) => {
      const product = response.data;
      const unitsOfSale = product.unitsOfSale;

      checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          checkboxId = checkbox.id;
          let match = false;
          // Add your logic here based on checkboxId and unitsOfSale
          unitsOfSale.forEach((unitOfSale) => {
            if (checkboxId === "واحدة" && unitOfSale.name === "individual") {
              match = true;
              populateTable(product, unitOfSale.unitPrice);
              updateGlobal(product, unitOfSale);
            } else if (
              checkboxId === "علبة" &&
              (unitOfSale.name === "Box" || unitOfSale.name === "box")
            ) {
              match = true;
              populateTable(product, unitOfSale.unitPrice);
              updateGlobal(product, unitOfSale);
            } else if (
              checkboxId === "كرتونة" &&
              unitOfSale.name === "bigBox"
            ) {
              match = true;
              populateTable(product, unitOfSale.unitPrice);
              updateGlobal(product, unitOfSale);
            }
          });
        }
      });
    })
    .catch((error) => {
      console.error("Error making Axios request:", error);
    });
}

function returnPurchase(purchaseId) {
  console.log(GlobalState.orderItems);
  axios
    .put(
      `https://localhost:7163/api/Purchase/ReturnPurchaseItems/?purchaseId=${purchaseId}`,
      GlobalState.orderItems
    )
    .then((response) => {
      GlobalState.orderItems.length = 0;
      // Handle success
      console.log("Response:", response.data);
    })
    .catch((error) => {
      // Handle error
      console.error("Error:", error);
    });
}

payButton.addEventListener("click", () => {
  returnPurchase(parseInt(orderIdInput.value));

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  totalPrice.textContent = "";
  productSearch.value = "";
  countInput.value = "1";
  orderIdInput.value = "";
});

// Initialize a variable to store the scanned barcode
let scannedBarcode = "";

document.addEventListener("keydown", (event) => {
  // Check if the key pressed is a valid barcode character
  if (event.key.length === 1) {
    // Concatenate the scanned digit to the barcode string
    scannedBarcode += event.key;
  } else if (event.key === "Enter") {
    console.log("j");
    axios
      .get(
        `https://localhost:7163/api/Product/GetProductBy?serialNumber=${scannedBarcode}`
      )
      .then((response) => {
        const product = response.data;
        const unitsOfSale = product.unitsOfSale;

        checkboxes.forEach((checkbox) => {
          if (checkbox.checked) {
            checkboxId = checkbox.id;
            let match = false;
            // Add your logic here based on checkboxId and unitsOfSale
            unitsOfSale.forEach((unitOfSale) => {
              if (checkboxId === "واحدة" && unitOfSale.name === "individual") {
                match = true;
                populateTable(product, unitOfSale.salePrice);
                updateGlobal(product, unitOfSale);
              } else if (
                checkboxId === "علبة" &&
                (unitOfSale.name === "Box" || unitOfSale.name === "box")
              ) {
                match = true;
                populateTable(product, unitOfSale.salePrice);
                updateGlobal(product, unitOfSale);
              } else if (
                checkboxId === "كرتونة" &&
                unitOfSale.name === "bigBox"
              ) {
                match = true;
                populateTable(product, unitOfSale.salePrice);
                updateGlobal(product, unitOfSale);
              }
            });
            if (!match) {
              alert("we're out of " + product.name);
            }
          }
        });
      })
      .catch((error) => {
        console.error("Error making Axios request:", error);
      });
    scannedBarcode = "";
  }
});
