const datepicker = require("js-datepicker");

document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});

// Function to get the query parameter from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const name = getQueryParam("name");
const productId = getQueryParam("productId");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

const submitButton = document.getElementById("submitButton");

submitButton.addEventListener("click", () => {
  const url = `product.html?name=${encodeURIComponent(
    name
  )}&productId=${encodeURIComponent(productId)}
  &startDate=${encodeURIComponent(startDate.value)}
  &endDate=${encodeURIComponent(endDate.value)}`;

  window.location.href = url;
});
