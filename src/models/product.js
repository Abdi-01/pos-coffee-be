"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product.init(
    {
      uuid: DataTypes.STRING,
      name: DataTypes.STRING,
      product_image: DataTypes.STRING,
      price: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "product",
    }
  );
  product.associate = (models) => {
    // one product can only have one category
    product.belongsTo(models.category, { foreignKey: "categoryId" });
    // one product can only have one status
    product.belongsTo(models.status, { foreignKey: "statusId" });
  };
  return product;
};
