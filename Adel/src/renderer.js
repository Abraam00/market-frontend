document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".page-link");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const pageName = button.id;
      navigateToPage(pageName);
    });
  });

  function navigateToPage(pageName) {
    // Create the browser window for the selected page.
    const { remote } = require("electron");
    const BrowserWindow = remote.BrowserWindow;
    const path = require("path");

    const newWindow = new BrowserWindow({
      width: 800,
      height: 600,
    });

    // Load the selected page (e.g., page1.html) using a file path.
    newWindow.loadFile(path.join(__dirname, `pages/${pageName}.html`));
  }
});
