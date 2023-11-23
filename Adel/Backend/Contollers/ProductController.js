const Product = require("../Models/Product");
const UnitPrice = require("../Models/UnitPrice");

async function createProductWithPrices(
  name,
  serialNum,
  unitType,
  purchasePrice,
  sellingPrice
) {
  try {
    // Check if the product already exists
    let product = await Product.findOne({
      where: { serialNum: serialNum },
    });

    if (!product) {
      // Create a new product if it doesn't exist
      product = await Product.create({
        serialNum,
        name,
      });
    }

    // Check if the unit price already exists for this product
    let unitPrice = await UnitPrice.findOne({
      where: {
        productId: product.id,
        unitType: unitType,
      },
    });

    if (unitPrice) {
      // Update the existing unit price
      await unitPrice.update({
        purchasePrice,
        sellingPrice,
      });
    } else {
      // Create a new unit price if it doesn't exist
      await UnitPrice.create({
        purchasePrice,
        sellingPrice,
        unitType,
        productId: product.id,
      });
    }

    console.log("Product and prices updated/created successfully.");
  } catch (error) {
    console.error("Error in product and prices operation:", error);
  }
}

async function getProductWithPrices(productId) {
  try {
    const product = await Product.findByPk(productId, {
      include: UnitPrice, // Include the unit prices associated with the product
    });

    if (!product) {
      console.log("Product not found!");
      return null;
    }

    // Return the product and its associated prices
    return product.toJSON();
  } catch (error) {
    console.error("Error fetching product and prices:", error);
    return null;
  }
}

async function getAllProductsWithPrices() {
  try {
    // Retrieve all products with their associated unit prices
    const products = await Product.findAll({
      include: [
        {
          model: UnitPrice,
          as: "unitPrices", // Ensure this alias matches the one defined in your model association
        },
      ],
    });

    // return products;

    return products.map((product) => product.toJSON());
  } catch (error) {
    console.error("Error fetching products and prices:", error);
    return [];
  }
}

async function deleteProductAndPrices(productId) {
  try {
    // Find the product
    const product = await Product.findByPk(productId);

    if (!product) {
      console.log("Product not found!");
      return;
    }

    // Delete associated unit prices
    await UnitPrice.destroy({
      where: { productId: product.id },
    });

    // Delete the product
    await product.destroy();

    console.log("Product and its prices deleted successfully.");
  } catch (error) {
    console.error("Error deleting product and prices:", error);
  }
}

// module.exports = {
//   createProductWithPrices,
//   getProductWithPrices,
//   deleteProductAndPrices,
// };

module.exports = {
  createProductWithPrices,
  getProductWithPrices,
  deleteProductAndPrices,
  getAllProductsWithPrices,
};
