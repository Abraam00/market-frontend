const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});

function saveCustomer() {
  const customerName = document.getElementById("customerName");
  const customerNumber = document.getElementById("customerNumber");
  const moneyRemaining = document.getElementById("moneyRemaining");

  const customerData = {
    name: customerName.value,
    customerNumber: customerNumber.value,
    moneyRemaining: parseInt(moneyRemaining.value),
  };

  axios
    .post("https://localhost:7163/api/Customer/CreateCustomer", customerData)
    .then((response) => {
      console.log("Customer saved successfully:", response.data);
      // Handle success
    })
    .catch((error) => {
      console.error("Error saving customer:", error);
      // Handle error
    });

  customerName.value = "";
  customerNumber.value = "";
  moneyRemaining.value = "";
}

document
  .getElementById("saveButton")
  .addEventListener("click", () => saveCustomer());
