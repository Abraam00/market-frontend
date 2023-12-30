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

const unitButton = document.getElementById("unitButton");
unitButton.addEventListener("click", () => {
  getProduct(productSearch.value);
});

function updateGlobal(item, unitOfSale) {
  let orderItem = {
    productId: item.productId,
    quantity: parseInt(countInput.value),
    unitType: unitOfSale.name,
    salePrice: unitOfSale.salePrice,
  };
  GlobalState.orderItems.push(orderItem);
}
const table = document.querySelector("table"); // Assuming you have a <table> element in your HTML
const tbody = table.querySelector("tbody");
let total = 0;

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
          // Add your logic here based on checkboxId and unitsOfSale
          unitsOfSale.forEach((unitOfSale) => {
            if (checkboxId === "واحدة" && unitOfSale.name === "individual") {
              populateTable(product, unitOfSale.salePrice);
              updateGlobal(product, unitOfSale);
            } else if (
              checkboxId === "علبة" &&
              (unitOfSale.name === "Box" || unitOfSale.name === "box")
            ) {
              populateTable(product, unitOfSale.salePrice);
              updateGlobal(product, unitOfSale);
            } else if (
              checkboxId === "كرتونة" &&
              unitOfSale.name === "bigBox"
            ) {
              populateTable(product, unitOfSale.salePrice);
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

const totalPrice = document.getElementById("total");
const countInput = document.getElementById("countInput");
const payButton = document.getElementById("payButton");
let itemTotal = 0;
//method to add the info to the table
function populateTable(item, salePrice) {
  const row = tbody.insertRow();
  itemTotal = parseInt(countInput.value, 10) * salePrice;

  const cellTotal = row.insertCell(0);
  cellTotal.textContent = itemTotal;

  const cellCount = row.insertCell(1);
  cellCount.textContent = countInput.value;

  const cellType = row.insertCell(2);
  cellType.textContent = checkboxId;

  const cellPrice = row.insertCell(3);
  cellPrice.textContent = salePrice;

  const cellName = row.insertCell(4);
  cellName.textContent = item.name;

  total += itemTotal;
  totalPrice.textContent = total;
}

const orderIdInput = document.getElementById("orderIdInput");
payButton.addEventListener("click", () => {
  alert("money to give back: " + totalPrice.textContent);
  returnOrder(orderIdInput.value);

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  totalPrice.textContent = "";
  productSearch.value = "";
  orderIdInput.value = "";
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
