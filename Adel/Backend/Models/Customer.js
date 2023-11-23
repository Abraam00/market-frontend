const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize"); // Adjust the path as needed
const Order = require("../Models/Order"); // Import Order model

class Customer extends Model {}

Customer.init(
  {
    name: DataTypes.STRING,
    customerNumber: DataTypes.STRING,
    moneyRemaining: DataTypes.DECIMAL,
  },
  { sequelize, modelName: "customer" }
);

// Relationship
Customer.hasMany(Order, { foreignKey: "customerId" });

module.exports = Customer;
