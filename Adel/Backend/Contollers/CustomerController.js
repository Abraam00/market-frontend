const Customer = require("../Models/Customer");

async function CreateCustomer(name, customerNumber) {
  let newCustomer = await Customer.findOne({
    where: { name: name, customerNumber: customerNumber },
  });

  if (!newCustomer) {
    newCustomer = await Customer.create({
      name,
      customerNumber,
      moneyRemaining: 0,
    });
  }
}

async function getCustomer(id, customerNumber) {
  try {
    let customer;

    if (id) {
      // Find by ID
      customer = await Customer.findByPk(id);
    } else if (customerNumber) {
      // Find by Customer Number
      customer = await Customer.findOne({ where: { customerNumber } });
    }

    if (!customer) {
      console.log("Customer not found!");
      return null;
    }

    return customer.toJSON();
  } catch (error) {
    console.error("Error finding customer:", error);
    return null;
  }
}

async function updateCustomer(id, customerNumber, amountToAdd) {
  try {
    let customer;

    if (id) {
      // Find by ID
      customer = await Customer.findByPk(id);
    } else if (customerNumber) {
      // Find by Customer Number
      customer = await Customer.findOne({ where: { customerNumber } });
    }

    if (!customer) {
      console.log("Customer not found!");
      return null;
    }

    const newMoneyRemaining = customer.moneyRemaining + amountToAdd;

    await customer.update({
      moneyRemaining: newMoneyRemaining,
    });

    console.log("Customer updated successfully.");
  } catch (error) {
    console.error("Error updating customer:", error);
  }
}

async function deleteCustomer(id, customerNumber) {
  try {
    let customer;

    if (id) {
      // Find by ID
      customer = await Customer.findByPk(id);
    } else if (customerNumber) {
      // Find by Customer Number
      customer = await Customer.findOne({ where: { customerNumber } });
    }

    if (!customer) {
      console.log("Customer not found!");
      return null;
    }

    await customer.destroy();

    console.log("Customer deleted successfully.");
  } catch (error) {
    console.error("Error deleting customer:", error);
  }
}

module.exports = {
  CreateCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};
