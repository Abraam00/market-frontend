const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const sequelize = require("../Backend/sequelize");

const Product = require("../Backend/Models/Product");
const UnitPrice = require("../Backend/Models/UnitPrice");
const Order = require("../Backend/Models/Order");
const OrderItem = require("../Backend/Models/OrderItem");
const Customer = require("../Backend/Models/Customer");
const Company = require("../Backend/Models/Company");
const Purchase = require("../Backend/Models/Purchase");
// Update the storage path
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

sequelize.sync().then(() => {
  console.log("Database and tables created for the supermarket!");
});

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
    },
  });

  mainWindow.webContents.openDevTools();

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
        path.join(__dirname, "./app/pages/moshtryat/mardod-moshtryat.html")
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
      mainWindow.loadFile(path.join(__dirname, "./app/pages/kart-elsanf.html"));
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

// const { app, BrowserWindow, ipcMain } = require("electron");
// const path = require("path");
// const { Sequelize, Model, DataTypes } = require("sequelize");
// const sequelize = new Sequelize({
//   dialect: "sqlite",
//   storage: "test.db",
// }); // Update the storage path
// // Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require("electron-squirrel-startup")) {
//   app.quit();
// }

// class User extends Model {}
// User.init(
//   {
//     name: DataTypes.STRING,
//     email: DataTypes.STRING,
//   },
//   { sequelize, modelName: "user" }
// );

// class Post extends Model {}
// Post.init(
//   {
//     title: DataTypes.STRING,
//     content: DataTypes.TEXT,
//   },
//   { sequelize, modelName: "post" }
// );

// // Define the relationship
// User.hasMany(Post);
// Post.belongsTo(User);

// sequelize.sync().then(async () => {
//   console.log("Database and tables created!");

//   // Creating a user
//   const user = await User.create({
//     name: "John Doe",
//     email: "john@example.com",
//   });

//   // Creating a post and linking it to the user
//   const post = await Post.create({
//     title: "Sample Post",
//     content: "This is a sample post.",
//     userId: user.id, // Linking the post to the user
//   });

//   console.log(
//     "User and Post created and linked:",
//     user.toJSON(),
//     post.toJSON()
//   );
// });

// ipcMain.handle("create-user", async (event, { name, email }) => {
//   try {
//     const user = await User.create({ name, email });
//     return user.get({ plain: true });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     throw error;
//   }
// });

// // Handler for creating a new post
// ipcMain.handle("create-post", async (event, { userId, title, content }) => {
//   try {
//     const post = await Post.create({ title, content, userId });
//     return post.get({ plain: true });
//   } catch (error) {
//     console.error("Error creating post:", error);
//     throw error;
//   }
// });

// const createWindow = () => {
//   // Create the browser window.
//   const mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js"),
//       nodeIntegration: true, // Enable Node.js integration
//       contextIsolation: false,
//       enableRemoteModule: true,
//     },
//   });

//   // and load the index.html of the app.
//   mainWindow.loadFile(path.join(__dirname, "index.html"));

//   ipcMain.on("navigate", (event, page) => {
//     // Handle navigation based on the button clicked.
//     if (page === "moshtryat") {
//       mainWindow.loadFile(
//         path.join(__dirname, "./app/pages/moshtryat/moshtryat.html")
//       );
//     } else if (page === "mardod-moshtryat") {
//       mainWindow.loadFile(
//         path.join(__dirname, "./app/pages/moshtryat/mardod-moshtryat.html")
//       );
//     } else if (page === "mabe3at") {
//       mainWindow.loadFile(
//         path.join(__dirname, "./app/pages/mabe3at/mabe3at.html")
//       );
//     } else if (page === "mardod-mabe3at") {
//       mainWindow.loadFile(
//         path.join(__dirname, "./app/pages/mardod-mabe3at/mardod-mabe3at.html")
//       );
//     } else if (page === "kashf-7sab") {
//       mainWindow.loadFile(
//         path.join(__dirname, "./app/pages/kashf-7sab/kashf-7sab.html")
//       );
//     } else if (page === "kart-elsanf") {
//       mainWindow.loadFile(path.join(__dirname, "./app/pages/kart-elsanf.html"));
//     }
//   });
// };

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on("ready", createWindow);

// // Quit when all windows are closed, except on macOS. There, it's common
// // for applications and their menu bar to stay active until the user quits
// // explicitly with Cmd + Q.
// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app.on("activate", () => {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });

// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and import them here.
