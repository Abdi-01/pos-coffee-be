const sequelize = require("sequelize");
const model = require("../models");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  add: async (req, res, next) => {
    try {
      let Temp = req.body.array;

      // find userId based on uuid in token
      let find = await model.user.findAll({
        where: {
          uuid: req.decrypt.uuid,
        },
      });
      let userId = find[0].dataValues.id;
      console.log("nomor", userId);

      // insert into transaction userId
      let transaction = await model.transaction.create({
        userId: userId,
      });

      // loop thorugh every item in the cart
      Temp.forEach(async (val, idx) => {
        console.log("ccccccccccccccc", val);
        let productId = await model.product.findAll({
          where: { uuid: val.uuid },
        });
        console.log("aaaaaaaaaaa", productId[0].dataValues.id);

        // to get each productId of item in cart
        let { id } = productId[0].dataValues;

        let bulk = await model.transaction_detail.create({
          total_quantity: val.total_quantity,
          total_price: val.total_quantity * val.price,
          price_on_date: val.price,
          productId: id,
          userId: userId,
          transactionId: transaction.dataValues.id,
        });
      });
      res.status(200).send("transaction completed");
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
