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
const name = getQueryParam("name");
const customerId = getQueryParam("customerId");
const customerNumber = getQueryParam("customerNumber");
const nameHeader = document.getElementById("nameHeader");
const madyonya = document.getElementById("madyonya");
nameHeader.textContent = "اسم العميل: " + name;

let customer;
let moneyRemaining;
axios
  .get(
    `https://localhost:7163/api/Customer/GetCustomer?customerNumber=${customerNumber}`
  )
  .then((response) => {
    customer = response.data;
    moneyRemaining = customer.moneyRemaining;
    madyonya.textContent = moneyRemaining;
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

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

const GlobalState = {
  orderItems: [],
};

const table = document.querySelector("table");
const tbody = table.querySelector("tbody");
const totalPrice = document.getElementById("total");
const payButton = document.getElementById("payButton");
const paidAmount = document.getElementById("payInput");

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
function updateGlobal(item, unitOfSale, count, salePrice) {
  let orderItem = {
    productId: item.productId,
    quantity: parseInt(count),
    unitType: unitOfSale.name,
    salePrice: parseInt(salePrice),
  };

  const index = GlobalState.orderItems.findIndex((existingItem) => {
    existingItem.productId === orderItem.productId &&
      existingItem.unitType === orderItem.unitType;
  });

  if (index > -1) {
    // Item with the same productId found, remove it
    GlobalState.orderItems.splice(index, 1);
  }

  GlobalState.orderItems.push(orderItem);
}

let itemTotal = 0;
let total = 0;
//getting the full product then populating the table using the populate table function based off of the selected unit
function getProduct(query) {
  axios
    .get(`https://localhost:7163/api/Product/GetProductByName/${query}`)
    .then((response) => {
      const product = response.data;
      const bigBoxUnit = product.unitsOfSale.find(
        (unit) => unit.name === "bigBox"
      );
      const boxUnit = product.unitsOfSale.find((unit) => unit.name === "box");
      const individualUnit = product.unitsOfSale.find(
        (unit) => unit.name === "individual"
      );

      const row = tbody.insertRow();
      var cellDelete = row.insertCell(0);
      const deleteRowButton = document.createElement("button");
      deleteRowButton.textContent = "delete";
      deleteRowButton.addEventListener("click", () => {
        var rowIndex = deleteRowButton.parentNode.parentNode;
        var productId = rowIndex.cells[1].innerText;
        var unitType = rowIndex.cells[5].innerText;
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
            parseInt(countInput.value) * parseInt(priceInput.value);
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
            if (parseInt(priceInput.value) < bigBoxUnit.unitPrice) {
              priceInput.value = bigBoxUnit.unitPrice;
            }
            total -= itemTotal;
            cellTotal.textContent =
              parseInt(countInput.value) * parseInt(priceInput.value);
            itemTotal = parseInt(cellTotal.textContent);
            total += itemTotal;
            totalPrice.textContent = total;
            updateGlobal(
              product,
              bigBoxUnit,
              countInput.value,
              priceInput.value
            );
            cellType.textContent = "bigBox";
            countInput.disabled = true;
            priceInput.disabled = true;
          } else if (
            dropdown.value === "box" &&
            (boxUnit.quantity != 0 ||
              parseInt(countInput.value) > boxUnit.quantity)
          ) {
            if (parseInt(priceInput.value) < boxUnit.unitPrice) {
              priceInput.value = boxUnit.unitPrice;
            }
            total -= itemTotal;
            cellTotal.textContent =
              parseInt(countInput.value) * parseInt(priceInput.value);
            itemTotal = parseInt(cellTotal.textContent);
            total += itemTotal;
            totalPrice.textContent = total;
            updateGlobal(product, boxUnit, countInput.value, priceInput.value);
            cellType.textContent = "box";
            dropdown.disabled = true;
            countInput.disabled = true;
            priceInput.disabled = true;
          } else if (
            dropdown.value === "individual" &&
            (individualUnit.quantity != 0 ||
              boxUnit.quantity != 0 ||
              parseInt(countInput.value) > individualUnit.quantity)
          ) {
            if (parseInt(priceInput.value) < individualUnit.unitPrice) {
              priceInput.value = individualUnit.unitPrice;
            }
            total -= itemTotal;
            cellTotal.textContent =
              parseInt(countInput.value) * parseInt(priceInput.value);
            itemTotal = parseInt(cellTotal.textContent);
            total += itemTotal;
            totalPrice.textContent = total;
            updateGlobal(
              product,
              individualUnit,
              countInput.value,
              priceInput.value
            );
            cellType.textContent = "individual";
            dropdown.disabled = true;
            countInput.disabled = true;
            priceInput.disabled = true;
          }
        }
      });
      cellCount.appendChild(countInput);

      var cellPrice = row.insertCell(4);
      const priceInput = document.createElement("input");
      priceInput.value = bigBoxUnit.salePrice;
      cellPrice.appendChild(priceInput);

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
          priceInput.value = bigBoxUnit.salePrice;
        } else if (dropdown.value === "box") {
          priceInput.value = boxUnit.salePrice;
        } else if (dropdown.value === "individual") {
          priceInput.value = individualUnit.salePrice;
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
function updateCustomer(name, customerNumber, moneyRemaining) {
  axios.put(
    `https://localhost:7163/api/Customer/UpdateCustomer/${customerId}`,
    {
      name: name,
      customerNumber: customerNumber,
      moneyRemaining: moneyRemaining,
    }
  );
}

function createOrder(customerId, moneyPaid) {
  axios
    .post("https://localhost:7163/api/Order/CreateOrder", {
      customerId: customerId,
      orderItems: GlobalState.orderItems,
      paymentType: "agel",
      moneyPaid: moneyPaid,
      orderNumber: "",
    })
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
  let moneyBack = parseInt(paidAmount.value) - parseInt(totalPrice.textContent);
  if (moneyBack > 0) {
    moneyRemaining = parseInt(moneyRemaining, 10) - moneyBack;
    if (moneyRemaining < 0) {
      alert("Money to give back" + moneyRemaining * -1);
      moneyRemaining = 0;
    }
    madyonya.textContent = moneyRemaining;
  } else {
    moneyRemaining = parseInt(moneyRemaining, 10) + moneyBack * -1;
    madyonya.textContent = moneyRemaining;
  }

  updateCustomer(name, customerNumber, moneyRemaining);
  createOrder(parseInt(customerId), parseInt(paidAmount.value));

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  GlobalState.orderItems = [];
  totalPrice.textContent = "";
  productSearch.value = "";
  paidAmount.value = "";
  itemTotal = 0;
  total = 0;
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
        const bigBoxUnit = product.unitsOfSale.find(
          (unit) => unit.name === "bigBox"
        );
        const boxUnit = product.unitsOfSale.find((unit) => unit.name === "box");
        const individualUnit = product.unitsOfSale.find(
          (unit) => unit.name === "individual"
        );

        const row = tbody.insertRow();
        var cellDelete = row.insertCell(0);
        const deleteRowButton = document.createElement("button");
        deleteRowButton.textContent = "delete";
        deleteRowButton.addEventListener("click", () => {
          var rowIndex = deleteRowButton.parentNode.parentNode;
          var productId = rowIndex.cells[1].innerText;
          var unitType = rowIndex.cells[5].innerText;
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
              parseInt(countInput.value) * parseInt(priceInput.value);
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
              if (parseInt(priceInput.value) < bigBoxUnit.unitPrice) {
                priceInput.value = bigBoxUnit.unitPrice;
              }
              total -= itemTotal;
              cellTotal.textContent =
                parseInt(countInput.value) * parseInt(priceInput.value);
              itemTotal = parseInt(cellTotal.textContent);
              total += itemTotal;
              totalPrice.textContent = total;
              updateGlobal(
                product,
                bigBoxUnit,
                countInput.value,
                priceInput.value
              );
              cellType.textContent = "bigBox";
              countInput.disabled = true;
              priceInput.disabled = true;
            } else if (
              dropdown.value === "box" &&
              (boxUnit.quantity != 0 ||
                parseInt(countInput.value) > boxUnit.quantity)
            ) {
              if (parseInt(priceInput.value) < boxUnit.unitPrice) {
                priceInput.value = boxUnit.unitPrice;
              }
              total -= itemTotal;
              cellTotal.textContent =
                parseInt(countInput.value) * parseInt(priceInput.value);
              itemTotal = parseInt(cellTotal.textContent);
              total += itemTotal;
              totalPrice.textContent = total;
              updateGlobal(
                product,
                boxUnit,
                countInput.value,
                priceInput.value
              );
              cellType.textContent = "box";
              dropdown.disabled = true;
              countInput.disabled = true;
              priceInput.disabled = true;
            } else if (
              dropdown.value === "individual" &&
              (individualUnit.quantity != 0 ||
                boxUnit.quantity != 0 ||
                parseInt(countInput.value) > individualUnit.quantity)
            ) {
              if (parseInt(priceInput.value) < individualUnit.unitPrice) {
                priceInput.value = individualUnit.unitPrice;
              }
              total -= itemTotal;
              cellTotal.textContent =
                parseInt(countInput.value) * parseInt(priceInput.value);
              itemTotal = parseInt(cellTotal.textContent);
              total += itemTotal;
              totalPrice.textContent = total;
              updateGlobal(
                product,
                individualUnit,
                countInput.value,
                priceInput.value
              );
              cellType.textContent = "individual";
              dropdown.disabled = true;
              countInput.disabled = true;
              priceInput.disabled = true;
            }
          }
        });
        cellCount.appendChild(countInput);

        var cellPrice = row.insertCell(4);
        const priceInput = document.createElement("input");
        priceInput.value = bigBoxUnit.salePrice;
        cellPrice.appendChild(priceInput);

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
            priceInput.value = bigBoxUnit.salePrice;
          } else if (dropdown.value === "box") {
            priceInput.value = boxUnit.salePrice;
          } else if (dropdown.value === "individual") {
            priceInput.value = individualUnit.salePrice;
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
