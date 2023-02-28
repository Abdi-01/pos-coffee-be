const sequelize = require("sequelize");
const model = require("../models");

module.exports = {

  //1. RETRIEVE PRODUCTS FROM DATABASE WITH PAGINATION
  list: async (req, res, next) => {
    try {
      let  { page, size, name, sortby, order } = req.query;  
      if (!page) {
        page = 0;
      }
      if (!size) {
        size = 6;
      }

      let get = await model.product.findAndCountAll({
        offset: parseInt(page * size),
        limit: parseInt(size),
        where: { name: { [sequelize.Op.like]: `%${name}%` } },
        order: [[ sortby , order ]]  
      });

      res.status(200).send({
        data: get.rows,
        totalPages: Math.ceil(get.count / size),
        datanum: get.count,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
