const Customer = require("../Models/Customer");
const Product = require("../Models/Product");
const Order = require("../Models/Order");
const OrderItem = require("../Models/OrderItem");
const UnitPrice = require("../Models/UnitPrice");

async function addOrder(
  customerId,
  paymentType,
  orderNum,
  productsWithUnitType
) {
  try {
    let customer = null;
    let total = 0;

    // Find the customer by name if provided
    if (customerId) {
      customer = await Customer.findByPk(customerId);
    }

    // Create a new order
    const order = await Order.create({
      customerId: customer ? customer.id : null,
      orderNum: orderNum,
      orderDate: new Date(),
      paymentType: customer ? paymentType : "Cash",
      transactionType: "Buying",
      total: total,
    });

    // Process each product with unit type to create order items
    for (const productInfo of productsWithUnitType) {
      const { serialNumber, unitType, quantity } = productInfo;

      // Find the product by serial number
      const product = await Product.findOne({
        where: { serialNum: serialNumber },
      });

      if (product) {
        // Find the unit price based on the unit type
        const unitPrice = await UnitPrice.findOne({
          where: { productId: product.id, unitType },
        });

        if (unitPrice) {
          total += unitPrice.sellingPrice * quantity;
          await OrderItem.create({
            orderId: order.id,
            productId: product.id,
            unitPrice: unitPrice.sellingPrice,
            unitType: unitType,
            quantity: quantity,
          });
        } else {
          console.log(
            `Unit price not found for product with serial number ${serialNumber} and unit type ${unitType}.`
          );
        }
      } else {
        console.log(`Product with serial number ${serialNumber} not found!`);
      }
    }

    // Update the total in the order
    order.total = total;
    await order.save();

    console.log("Order created successfully.");
    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    if (order) {
      await deleteOrder(order.id);
    }
    return null;
  }
}

// delete order and all its items
async function deleteOrder(orderId) {
  try {
    // Find the order by ID
    const order = await Order.findByPk(orderId);

    if (!order) {
      console.log("Order not found!");
      return null;
    }

    // Delete all order items associated with the order
    await OrderItem.destroy({ where: { orderId } });

    // Delete the order
    await order.destroy();

    console.log("Order deleted successfully.");
  } catch (error) {
    console.error("Error deleting order:", error);
  }
}

async function getOrderByOrderNum(orderNum) {
  try {
    const order = await Order.findOne({
      where: { orderNum },
      include: OrderItem,
    });

    if (!order) {
      console.log("Order not found!");
      return null;
    }

    // Convert the order to a JSON object
    const orderJson = order.toJSON();

    // Fetch the product name for each order item
    for (const item of orderJson.orderItems) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        item.productName = product.name;
      }
    }

    return orderJson;
  } catch (error) {
    console.error("Error finding order:", error);
    return null;
  }
}

async function getOrderByCustomerId(customerId) {
  try {
    const order = await Order.findOne({
      where: { customerId },
      include: OrderItem,
    });

    if (!order) {
      console.log("Order not found!");
      return null;
    }

    // Convert the order to a JSON object
    const orderJson = order.toJSON();

    // Fetch the product name for each order item
    for (const item of orderJson.orderItems) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        item.productName = product.name;
      }
    }

    return orderJson;
  } catch (error) {
    console.error("Error finding order:", error);
    return null;
  }
}

module.exports = {
  addOrder,
  deleteOrder,
  getOrderByOrderNum,
  getOrderByCustomerId,
};
