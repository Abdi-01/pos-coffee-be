'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaction_detail.init({
    uuid: DataTypes.STRING,
    total_quantity: DataTypes.INTEGER,
    total_price: DataTypes.INTEGER,
    price_on_date: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    customer_name: DataTypes.STRING,
    statusId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaction_detail',
  });
  return transaction_detail;
};