const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize"); // Adjust the path as needed
const OrderItem = require("../Models/OrderItem"); // Import OrderItem model

class Purchase extends Model {}

Purchase.init(
  {
    purchaseDate: DataTypes.DATE,
    transactionType: DataTypes.STRING, // e.g., 'Buying', 'Returning'
    companyName: DataTypes.STRING,
  },
  { sequelize, modelName: "purchase" }
);

// Relationship
Purchase.hasMany(OrderItem, { foreignKey: "purchaseId" });

module.exports = Purchase;
