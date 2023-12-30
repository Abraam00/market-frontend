const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});

// Get the button container element
const buttonContainer = document.getElementById("buttonContainer");

let companies;
axios
  .get("https://localhost:7163/api/Company/GetCompanies")
  .then((response) => {
    companies = response.data;
    // Create buttons dynamically based on the names
    companies.forEach((company) => {
      const button = document.createElement("button");
      button.className = "big-button";
      button.textContent = company.companyName;

      button.addEventListener("click", () => {
        // Construct the URL with the name as a query parameter
        const url = `company.html?name=${encodeURIComponent(
          company.companyName
        )}&companyId=${encodeURIComponent(
          company.companyId
        )}&companyNumber=${encodeURIComponent(company.companyNumber)}`;

        window.location.href = url;
      });

      buttonContainer.appendChild(button);
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
