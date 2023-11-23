const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize"); // Adjust the path as needed

class Company extends Model {}

Company.init(
  {
    name: DataTypes.STRING,
    companyNumber: DataTypes.STRING,
  },
  { sequelize, modelName: "company" }
);

module.exports = Company;
