// Function to format the date in mm-dd-yyyy
function formatDate(date) {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [month, day, year].join('-');
}

// Initialize date pickers with flatpickr
flatpickr("#startDate", {
  dateFormat: "m-d-Y",
  onChange: function(selectedDates, dateStr, instance) {
    instance.input.value = formatDate(selectedDates[0]);
  }
});

flatpickr("#endDate", {
  dateFormat: "m-d-Y",
  onChange: function(selectedDates, dateStr, instance) {
    instance.input.value = formatDate(selectedDates[0]);
  }
});

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
