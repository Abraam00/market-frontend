const axios = require("axios");

const GlobalState = {
  orderItems: [],
};

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

const nameHeader = document.getElementById("nameHeader");
nameHeader.textContent = "اسم العامل: " + "جلجل";

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
      getProduct(item);
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

function removeFromGlobal(productId, unitOfSale) {
  const index = GlobalState.orderItems.findIndex((existingItem) => {
    return (
      existingItem.productId === parseInt(productId) &&
      existingItem.unitType === unitOfSale
    );
  });

  if (index > -1) {
    // Item with the same productId found, remove it
    GlobalState.orderItems.splice(index, 1);
  }
}

function updateGlobal(item, unitOfSale, count) {
  let orderItem = {
    productId: item.productId,
    quantity: parseInt(count),
    unitType: unitOfSale.name,
    salePrice: unitOfSale.salePrice,
  };
  GlobalState.orderItems.push(orderItem);
}
const table = document.querySelector("table"); // Assuming you have a <table> element in your HTML
const tbody = table.querySelector("tbody");
const totalPrice = document.getElementById("total");
const payButton = document.getElementById("payButton");

let itemTotal = 0;
let total = 0;
//getting the full product then populating the table using the populate table function based off of the selected unit
function getProduct(query) {
  axios
    .get(`https://localhost:7163/api/Product/GetProductByName/${query}`)
    .then((response) => {
      const product = response.data;
      const bigBoxUnit = product.unitsOfSale[0];
      const boxUnit = product.unitsOfSale[1];
      const individualUnit = product.unitsOfSale[2];

      const row = tbody.insertRow();
      var cellDelete = row.insertCell(0);
      const deleteRowButton = document.createElement("button");
      deleteRowButton.textContent = "delete";
      deleteRowButton.addEventListener("click", () => {
        var rowIndex = deleteRowButton.parentNode.parentNode;
        var unitType = rowIndex.cells[5].innerText;
        var productId = rowIndex.cells[1].innerText;
        var removableTotal = rowIndex.cells[2].innerText;
        total -= parseInt(removableTotal);
        totalPrice.textContent = total;
        removeFromGlobal(productId, unitType);
        table.deleteRow(rowIndex.rowIndex);
      });

      cellDelete.appendChild(deleteRowButton);

      var cellProductId = row.insertCell(1);
      cellProductId.textContent = product.productId;
      var cellTotal = row.insertCell(2);

      var cellCount = row.insertCell(3);
      const countInput = document.createElement("input");
      countInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
          cellTotal.textContent =
            parseInt(countInput.value) * parseInt(cellPrice.textContent);
          itemTotal = parseInt(cellTotal.textContent);
          if (isNaN(total)) {
            total = 0;
          }
          total += itemTotal;
          totalPrice.textContent = total;
          if (
            dropdown.value === "bigBox" &&
            (bigBoxUnit.quantity != 0 ||
              parseInt(countInput.value) > bigBoxUnit.quantity)
          ) {
            total -= itemTotal;
            cellTotal.textContent =
              parseInt(countInput.value) * parseInt(cellPrice.textContent);
            itemTotal = parseInt(cellTotal.textContent);
            total += itemTotal;
            totalPrice.textContent = total;
            updateGlobal(product, bigBoxUnit, countInput.value);
            cellType.textContent = "bigBox";
            countInput.disabled = true;
          } else if (
            dropdown.value === "box" &&
            (boxUnit.quantity != 0 ||
              parseInt(countInput.value) > boxUnit.quantity)
          ) {
            total -= itemTotal;
            cellPrice.textContent = boxUnit.salePrice;
            cellTotal.textContent =
              parseInt(countInput.value) * parseInt(cellPrice.textContent);
            itemTotal = parseInt(cellTotal.textContent);
            total += itemTotal;
            totalPrice.textContent = total;
            updateGlobal(product, boxUnit, countInput.value);
            cellType.textContent = "box";
            dropdown.disabled = true;
            countInput.disabled = true;
          } else if (
            dropdown.value === "individual" &&
            (individualUnit.quantity != 0 ||
              boxUnit.quantity != 0 ||
              parseInt(countInput.value) > individualUnit.quantity)
          ) {
            total -= itemTotal;
            cellPrice.textContent = individualUnit.salePrice;
            cellTotal.textContent =
              parseInt(countInput.value) * parseInt(cellPrice.textContent);
            itemTotal = parseInt(cellTotal.textContent);
            total += itemTotal;
            totalPrice.textContent = total;
            updateGlobal(product, individualUnit, countInput.value);
            cellType.textContent = "individual";
            dropdown.disabled = true;
            countInput.disabled = true;
          }
        }
      });
      cellCount.appendChild(countInput);

      var cellPrice = row.insertCell(4);
      cellPrice.textContent = bigBoxUnit.salePrice;

      const cellType = row.insertCell(5);
      const dropdown = document.createElement("select");

      // Add options to the dropdown menu (replace 'optionValue' with your actual values)
      const bigBox = document.createElement("option");
      bigBox.value = "bigBox";
      bigBox.textContent = "bigBox";
      dropdown.appendChild(bigBox);

      const box = document.createElement("option");
      box.value = "box";
      box.textContent = "box";
      dropdown.appendChild(box);

      const individual = document.createElement("option");
      individual.value = "individual";
      individual.textContent = "individual";
      dropdown.appendChild(individual);
      dropdown.addEventListener("change", () => {
        if (dropdown.value === "bigBox") {
          cellPrice.textContent = bigBoxUnit.salePrice;
        } else if (dropdown.value === "box") {
          cellPrice.textContent = boxUnit.salePrice;
        } else if (dropdown.value === "individual") {
          cellPrice.textContent = individualUnit.salePrice;
        }
      });
      cellType.appendChild(dropdown);

      const cellName = row.insertCell(6);
      cellName.textContent = product.name;
    })
    .catch((error) => {
      console.error("Error making Axios request:", error);
    });
}

const orderIdInput = document.getElementById("orderIdInput");
payButton.addEventListener("click", () => {
  alert("money to give back: " + totalPrice.textContent);
  returnOrder(orderIdInput.value);

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  GlobalState.orderItems = [];
  totalPrice.textContent = "";
  productSearch.value = "";
  orderIdInput.value = "";
  itemTotal = 0;
  total = 0;
});

function returnOrder(orderId) {
  if (orderId === "") {
    axios
      .post(
        "https://localhost:7163/api/Order/returnOrderItemsWithoutOrderNumber",
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
  } else {
    let id = parseInt(orderId);
    axios
      .put(
        `https://localhost:7163/api/Order/returnOrderItems/${id}`,
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
}

const agelButton = document.getElementById("agelButton");

agelButton.addEventListener("click", () => {
  window.location.href = "agel.html";
});

// Initialize a variable to store the scanned barcode
let scannedBarcode = "";

document.addEventListener("keydown", (event) => {
  // Check if the key pressed is a valid barcode character
  if (event.key.length === 1) {
    // Concatenate the scanned digit to the barcode string
    scannedBarcode += event.key;
  } else if (event.key === "Enter") {
    axios
      .get(
        `https://localhost:7163/api/Product/GetProductBy?serialNumber=${scannedBarcode}`
      )
      .then((response) => {
        const product = response.data;
        const bigBoxUnit = product.unitsOfSale[0];
        const boxUnit = product.unitsOfSale[1];
        const individualUnit = product.unitsOfSale[2];

        const row = tbody.insertRow();
        var cellDelete = row.insertCell(0);
        const deleteRowButton = document.createElement("button");
        deleteRowButton.textContent = "delete";
        deleteRowButton.addEventListener("click", () => {
          var rowIndex = deleteRowButton.parentNode.parentNode;
          var unitType = rowIndex.cells[5].innerText;
          var productId = rowIndex.cells[1].innerText;
          var removableTotal = rowIndex.cells[2].innerText;
          total -= parseInt(removableTotal);
          totalPrice.textContent = total;
          removeFromGlobal(productId, unitType);
          table.deleteRow(rowIndex.rowIndex);
        });

        cellDelete.appendChild(deleteRowButton);

        var cellProductId = row.insertCell(1);
        cellProductId.textContent = product.productId;
        var cellTotal = row.insertCell(2);

        var cellCount = row.insertCell(3);
        const countInput = document.createElement("input");
        countInput.addEventListener("keyup", (event) => {
          if (event.key === "Enter") {
            cellTotal.textContent =
              parseInt(countInput.value) * parseInt(cellPrice.textContent);
            itemTotal = parseInt(cellTotal.textContent);
            if (isNaN(total)) {
              total = 0;
            }
            total += itemTotal;
            totalPrice.textContent = total;
            if (
              dropdown.value === "bigBox" &&
              (bigBoxUnit.quantity != 0 ||
                parseInt(countInput.value) > bigBoxUnit.quantity)
            ) {
              total -= itemTotal;
              cellTotal.textContent =
                parseInt(countInput.value) * parseInt(cellPrice.textContent);
              itemTotal = parseInt(cellTotal.textContent);
              total += itemTotal;
              totalPrice.textContent = total;
              updateGlobal(product, bigBoxUnit, countInput.value);
              cellType.textContent = "bigBox";
              countInput.disabled = true;
            } else if (
              dropdown.value === "box" &&
              (boxUnit.quantity != 0 ||
                parseInt(countInput.value) > boxUnit.quantity)
            ) {
              total -= itemTotal;
              cellPrice.textContent = boxUnit.salePrice;
              cellTotal.textContent =
                parseInt(countInput.value) * parseInt(cellPrice.textContent);
              itemTotal = parseInt(cellTotal.textContent);
              total += itemTotal;
              totalPrice.textContent = total;
              updateGlobal(product, boxUnit, countInput.value);
              cellType.textContent = "box";
              dropdown.disabled = true;
              countInput.disabled = true;
            } else if (
              dropdown.value === "individual" &&
              (individualUnit.quantity != 0 ||
                boxUnit.quantity != 0 ||
                parseInt(countInput.value) > individualUnit.quantity)
            ) {
              total -= itemTotal;
              cellPrice.textContent = individualUnit.salePrice;
              cellTotal.textContent =
                parseInt(countInput.value) * parseInt(cellPrice.textContent);
              itemTotal = parseInt(cellTotal.textContent);
              total += itemTotal;
              totalPrice.textContent = total;
              updateGlobal(product, individualUnit, countInput.value);
              cellType.textContent = "individual";
              dropdown.disabled = true;
              countInput.disabled = true;
            }
          }
        });
        cellCount.appendChild(countInput);

        var cellPrice = row.insertCell(4);
        cellPrice.textContent = bigBoxUnit.salePrice;

        const cellType = row.insertCell(5);
        const dropdown = document.createElement("select");

        // Add options to the dropdown menu (replace 'optionValue' with your actual values)
        const bigBox = document.createElement("option");
        bigBox.value = "bigBox";
        bigBox.textContent = "bigBox";
        dropdown.appendChild(bigBox);

        const box = document.createElement("option");
        box.value = "box";
        box.textContent = "box";
        dropdown.appendChild(box);

        const individual = document.createElement("option");
        individual.value = "individual";
        individual.textContent = "individual";
        dropdown.appendChild(individual);
        dropdown.addEventListener("change", () => {
          if (dropdown.value === "bigBox") {
            cellPrice.textContent = bigBoxUnit.salePrice;
          } else if (dropdown.value === "box") {
            cellPrice.textContent = boxUnit.salePrice;
          } else if (dropdown.value === "individual") {
            cellPrice.textContent = individualUnit.salePrice;
          }
        });
        cellType.appendChild(dropdown);

        const cellName = row.insertCell(6);
        cellName.textContent = product.name;
      })
      .catch((error) => {
        console.error("Error making Axios request:", error);
      });
    scannedBarcode = "";
  }
});
