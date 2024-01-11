const axios = require("axios");
const table = document.querySelector("table");
const tbody = table.querySelector("tbody");
const totalPrice = document.getElementById("total");
const payButton = document.getElementById("payButton");
const paidAmount = document.getElementById("payInput");

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

const agelButton = document.getElementById("agelButton");
agelButton.addEventListener("click", () => {
  window.location.href = "agel.html";
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

function updateGlobal(item, unitOfSale, count) {
  let orderItem = {
    productId: item.productId,
    quantity: parseInt(count),
    unitType: unitOfSale.name,
    salePrice: unitOfSale.salePrice,
  };

  const index = GlobalState.orderItems.findIndex(
    (existingItem) => existingItem.productId === orderItem.productId
  );

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
      const bigBoxUnit = product.unitsOfSale[0];
      const boxUnit = product.unitsOfSale[1];
      const individualUnit = product.unitsOfSale[2];

      const row = tbody.insertRow();
      var cellTotal = row.insertCell(0);

      var cellCount = row.insertCell(1);
      const countInput = document.createElement("input");
      countInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
          cellTotal.textContent =
            parseInt(countInput.value) * parseInt(cellPrice.textContent);
          itemTotal = parseInt(cellTotal.textContent);
          total += itemTotal;
          totalPrice.textContent = total;
          updateGlobal(product, bigBoxUnit, countInput.value);
        }
      });
      cellCount.appendChild(countInput);

      var cellPrice = row.insertCell(2);
      cellPrice.textContent = bigBoxUnit.salePrice;

      const cellType = row.insertCell(3);
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
        const selectedValue = dropdown.value;

        // Check the selected option and update cellPrice and cellTotal accordingly
        if (
          selectedValue === "bigBox" ||
          parseInt(countInput.value) > bigBoxUnit.quantity
        ) {
          if (bigBoxUnit.quantity != 0) {
            total -= itemTotal;
            cellPrice.textContent = bigBoxUnit.salePrice;
            cellTotal.textContent =
              parseInt(countInput.value) * parseInt(cellPrice.textContent);
            itemTotal = parseInt(cellTotal.textContent);
            total += itemTotal;
            totalPrice.textContent = total;
            updateGlobal(product, bigBoxUnit, countInput.value);
          } else {
            alert("we're out of bigBoxes of " + product.name);
          }
        } else if (
          selectedValue === "box" ||
          parseInt(countInput.value) > bigBoxUnit.quantity
        ) {
          if (boxUnit.quantity != 0) {
            total -= itemTotal;
            cellPrice.textContent = boxUnit.salePrice;
            cellTotal.textContent =
              parseInt(countInput.value) * parseInt(cellPrice.textContent);
            itemTotal = parseInt(cellTotal.textContent);
            total += itemTotal;
            totalPrice.textContent = total;
            updateGlobal(product, boxUnit, countInput.value);
          } else {
            alert("we're out of boxes of " + product.name);
          }
        } else if (selectedValue === "individual") {
          if (
            individualUnit.quantity != 0 ||
            parseInt(countInput.value) > individualUnit.quantity
          ) {
            total -= itemTotal;
            cellPrice.textContent = individualUnit.salePrice;
            cellTotal.textContent =
              parseInt(countInput.value) * parseInt(cellPrice.textContent);
            itemTotal = parseInt(cellTotal.textContent);
            total += itemTotal;
            totalPrice.textContent = total;
            updateGlobal(product, individualUnit, countInput.value);
          } else {
            alert("we're out of individual of " + product.name);
          }
        }
      });

      cellType.appendChild(dropdown);

      const cellName = row.insertCell(4);
      cellName.textContent = product.name;
    })
    .catch((error) => {
      console.error("Error making Axios request:", error);
    });
}

payButton.addEventListener("click", () => {
  alert(
    "money to give back: " +
      (parseInt(paidAmount.value) - parseInt(totalPrice.textContent))
  );

  createOrder(parseInt(paidAmount.value));
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  totalPrice.textContent = "";
  productSearch.value = "";
  paidAmount.value = "";
  itemTotal = 0;
  total = 0;
});

function createOrder(moneyPaid) {
  console.log(GlobalState.orderItems);
  axios
    .post("https://localhost:7163/api/Order/CreateOrder", {
      customerId: null,
      orderItems: GlobalState.orderItems,
      paymentType: "cash",
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
        var cellTotal = row.insertCell(0);

        var cellCount = row.insertCell(1);
        const countInput = document.createElement("input");
        countInput.addEventListener("keyup", (event) => {
          if (event.key === "Enter") {
            cellTotal.textContent =
              parseInt(countInput.value) * parseInt(cellPrice.textContent);
            itemTotal = parseInt(cellTotal.textContent);
            total += itemTotal;
            totalPrice.textContent = total;
            updateGlobal(product, bigBoxUnit, countInput.value);
          }
        });
        cellCount.appendChild(countInput);

        var cellPrice = row.insertCell(2);
        cellPrice.textContent = bigBoxUnit.salePrice;

        const cellType = row.insertCell(3);
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
          const selectedValue = dropdown.value;

          // Check the selected option and update cellPrice and cellTotal accordingly
          if (
            selectedValue === "bigBox" ||
            parseInt(countInput.value) > bigBoxUnit.quantity
          ) {
            if (bigBoxUnit.quantity != 0) {
              total -= itemTotal;
              cellPrice.textContent = bigBoxUnit.salePrice;
              cellTotal.textContent =
                parseInt(countInput.value) * parseInt(cellPrice.textContent);
              itemTotal = parseInt(cellTotal.textContent);
              total += itemTotal;
              totalPrice.textContent = total;
              updateGlobal(product, bigBoxUnit, countInput.value);
            } else {
              alert("we're out of bigBoxes of " + product.name);
            }
          } else if (
            selectedValue === "box" ||
            parseInt(countInput.value) > bigBoxUnit.quantity
          ) {
            if (boxUnit.quantity != 0) {
              total -= itemTotal;
              cellPrice.textContent = boxUnit.salePrice;
              cellTotal.textContent =
                parseInt(countInput.value) * parseInt(cellPrice.textContent);
              itemTotal = parseInt(cellTotal.textContent);
              total += itemTotal;
              totalPrice.textContent = total;
              updateGlobal(product, boxUnit, countInput.value);
            } else {
              alert("we're out of boxes of " + product.name);
            }
          } else if (selectedValue === "individual") {
            if (
              individualUnit.quantity != 0 ||
              parseInt(countInput.value) > individualUnit.quantity
            ) {
              total -= itemTotal;
              cellPrice.textContent = individualUnit.salePrice;
              cellTotal.textContent =
                parseInt(countInput.value) * parseInt(cellPrice.textContent);
              itemTotal = parseInt(cellTotal.textContent);
              total += itemTotal;
              totalPrice.textContent = total;
              updateGlobal(product, individualUnit, countInput.value);
            } else {
              alert("we're out of individual of " + product.name);
            }
          }
        });

        cellType.appendChild(dropdown);

        const cellName = row.insertCell(4);
        cellName.textContent = product.name;
      })
      .catch((error) => {
        console.error("Error making Axios request:", error);
      });
    scannedBarcode = "";
  }
});
