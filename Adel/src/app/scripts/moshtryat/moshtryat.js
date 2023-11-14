document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});

// Simulated data from the backend, replace this with actual data received from your backend.
const names = ["اديتا", "اديتا", "اديتا", "اديتا", "اديتا", "اديتا"];

// Get the button container element
const buttonContainer = document.getElementById("buttonContainer");

// Create buttons dynamically based on the names
names.forEach((name) => {
  const button = document.createElement("button");
  button.className = "big-button";
  button.textContent = name;

  button.addEventListener("click", () => {
    // Construct the URL with the name as a query parameter
    const url = `company.html?name=${name}`;
    window.location.href = url;
  });

  buttonContainer.appendChild(button);
});
