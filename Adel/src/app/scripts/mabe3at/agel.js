document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});

// Simulated data from the backend, replace this with actual data received from your backend.
const names = ["Bola", "Eimo", "Baba", "Abram", "Nour", "Mama"];

// Get the button container element
const buttonContainer = document.getElementById("buttonContainer");

// Create buttons dynamically based on the names
names.forEach((name) => {
  const button = document.createElement("button");
  button.className = "big-button";
  button.textContent = name;

  // Add a click event listener to each button (you can add navigation logic here)
  button.addEventListener("click", () => {
    window.location.href = "client.html";
  });

  // Append the button to the container
  buttonContainer.appendChild(button);
});
