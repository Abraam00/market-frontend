document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});

const company = document.getElementById("company");
const client = document.getElementById("client");

company.addEventListener("click", () => {
  window.location.href = "companies.html";
});
client.addEventListener("click", () => {
  window.location.href = "clients.html";
});
