"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  category.init(
    {
      category: DataTypes.STRING,
      statusId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "category",
    }
  );
  category.associate = (models) => {
    // one category can belong to many products
    category.hasMany(models.product, { foreignKey: "categoryId" });
    category.belongsTo(models.status, { foreignKey: "statusId" });
  };
  return category;
};
