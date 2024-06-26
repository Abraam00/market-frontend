const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true, // Enable Node.js integration
			contextIsolation: false,
			enableRemoteModule: true,
			devTools: true,
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, "index.html"));

	ipcMain.on("navigate", (event, page) => {
		// Handle navigation based on the button clicked.
		if (page === "moshtryat") {
			mainWindow.loadFile(
				path.join(__dirname, "./app/pages/moshtryat/moshtryat.html")
			);
		} else if (page === "mardod-moshtryat") {
			mainWindow.loadFile(
				path.join(
					__dirname,
					"./app/pages/mardod-moshtryat/mardod-moshtryat.html"
				)
			);
		} else if (page === "mabe3at") {
			mainWindow.loadFile(
				path.join(__dirname, "./app/pages/mabe3at/mabe3at.html")
			);
		} else if (page === "mardod-mabe3at") {
			mainWindow.loadFile(
				path.join(__dirname, "./app/pages/mardod-mabe3at/mardod-mabe3at.html")
			);
		} else if (page === "kashf-7sab") {
			mainWindow.loadFile(
				path.join(__dirname, "./app/pages/kashf-7sab/kashf-7sab.html")
			);
		} else if (page === "kart-elsanf") {
			mainWindow.loadFile(
				path.join(__dirname, "./app/pages/kart-elsanf/kart-elsanf.html")
			);
		} else if (page === "edafet-3ameel") {
			mainWindow.loadFile(
				path.join(__dirname, "./app/pages/other/edafet-3ameel.html")
			);
		} else if (page === "edafet-sherka") {
			mainWindow.loadFile(
				path.join(__dirname, "./app/pages/other/edafet-sherka.html")
			);
		} else if (page === "taxable-purchases") {
			mainWindow.loadFile(
				path.join("./src/app/pages/other/taxable-purhcases.html")
			);
		} else if (page === "edaft-sanf") {
			mainWindow.loadFile(
				path.join(__dirname, "./app/pages/other/edaft-sanf.html")
			);
		} else if (page === "editProduct") {
			mainWindow.loadFile(
				path.join(__dirname, "./app/pages/other/editProduct.html")
			);
		} else if (page === "customerPayOff") {
			mainWindow.loadFile(
				path.join(__dirname, "./app/pages/other/customerPayOff.html")
			);
		} else if (page === "inventory") {
			mainWindow.loadFile(
				path.join(__dirname, "./app/pages/other/inventory.html")
			);
		} else if (page === "removeProduct") {
			mainWindow.loadFile(
				path.join(__dirname, "./app/pages/other/removeProduct.html")
			);
		}
	});
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
