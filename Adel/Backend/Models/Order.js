const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize"); // Adjust the path as needed
const OrderItem = require("../Models/OrderItem"); // Import OrderItem model

class Order extends Model {}

Order.init(
  {
    orderNum: DataTypes.STRING,
    orderDate: DataTypes.DATE,
    total: DataTypes.DECIMAL,
    paymentType: DataTypes.STRING, // e.g., 'Cash', 'Finance'
    transactionType: DataTypes.STRING, // e.g., 'Buying', 'Returning'
  },
  { sequelize, modelName: "order" }
);

// Relationships
Order.hasMany(OrderItem, { foreignKey: "orderId" });

module.exports = Order;
