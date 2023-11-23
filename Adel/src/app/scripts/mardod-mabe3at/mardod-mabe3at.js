const {
  createProductWithPrices,
  getProductWithPrices,
  deleteProductAndPrices,
  getAllProductsWithPrices,
} = require("../../../../Backend/Contollers/ProductController");

const {
  CreateCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../../../../Backend/Contollers/CustomerController");

const {
  addOrder,
  deleteOrder,
  getOrderByOrderNum,
  getOrderByCustomerId,
} = require("../../../../Backend/Contollers/OrderController");

document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});
document.getElementById("cash").addEventListener("click", () => {
  window.location.href = "cash.html";
});

document.getElementById("agel").addEventListener("click", async () => {
  // window.location.href = "agel.html";

  //Products

  // createProductWithPrices("Chips", "1234", "palett", 10, 50);
  // createProductWithPrices("Chocolate", "1233", "palett", 10, 50);

  // deleteProductAndPrices(1);

  // const product = await getProductWithPrices(2);
  // if (product) {
  //   console.log("Fetched Product:", product);
  // } else {
  //   console.log("Product not found.");
  // }

  // const products = await getAllProductsWithPrices();
  // if (products) {
  //   console.log("Fetched Product:", products);
  // } else {
  //   console.log("Product not found.");
  // }

  // Customers
  // CreateCustomer("Bola", 1);

  // const customer = await getCustomer(1, null);
  // console.log("Customer:", customer);

  // updateCustomer(1, null, -500);

  // deleteCustomer(1, null);

  // Orders
  // addOrder(
  //   customerId = null,
  //   paymentMethod = "Finance",
  //   orderId = 13,
  //   products = [
  //     { serialNumber: "1234", unitType: "palett", quantity: 20 },
  //     { serialNumber: "1233", unitType: "palett", quantity: 20 },
  //   ]
  // );

  // deleteOrder(5);
  // const order = await getOrderByOrderNum(13);
  const order = await getOrderByCustomerId(1);
  console.log("Order:", order);
});
