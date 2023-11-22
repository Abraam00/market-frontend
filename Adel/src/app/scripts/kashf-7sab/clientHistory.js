document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});

// Simulated data from the backend, replace this with actual data received from your backend.
const dates = ["11/12/23", "10/2/23", "10/10/22", "1/3/22", "1/1/21", "2/3/21"];

// Get the button container element
const buttonContainer = document.getElementById("buttonContainer");

// Create buttons dynamically based on the names
dates.forEach((date) => {
  const button = document.createElement("button");
  button.className = "big-button";
  button.textContent = date;

  button.addEventListener("click", () => {
    // Construct the URL with the name as a query parameter
    const url = `client.html?name=${name + ": " + date}`;
    window.location.href = url;
  });

  buttonContainer.appendChild(button);
});
