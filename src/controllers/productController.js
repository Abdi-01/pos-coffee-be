const sequelize = require("sequelize");
const model = require("../models");
const { v4: uuidv4 } = require("uuid");
const { where } = require("sequelize");
const fs = require("fs");

module.exports = {
  //1. RETRIEVE PRODUCTS FROM DATABASE WITH PAGINATION
  list: async (req, res, next) => {
    try {
      let { page, size, name, sortby, order, status, category } = req.query;
      if (!page) {
        page = 0;
      }
      if (!size) {
        size = 6;
      }
      if (!sortby) {
        sortby = "name";
      }
      if (!order) {
        order = "ASC";
      }

      if (!status) {
        let get = await model.product.findAndCountAll({
          offset: parseInt(page * size),
          limit: parseInt(size),
          where: { name: { [sequelize.Op.like]: `%${name}%` } },
          include: [
            {
              model: model.category,
              attributes: ["category"],
              where: {
                category: { [sequelize.Op.like]: `%${category}%` },
              },
            },
            { model: model.status, attributes: ["status"] },
          ],
          order: [[sortby, order]],
        });

        return res.status(200).send({
          data: get.rows,
          totalPages: Math.ceil(get.count / size),
          datanum: get.count,
        });
      }

      let get = await model.product.findAndCountAll({
        offset: parseInt(page * size),
        limit: parseInt(size),
        where: { name: { [sequelize.Op.like]: `%${name}%` }, statusId: status },
        include: [
          {
            model: model.category,
            attributes: ["category"],
            where: {
              category: { [sequelize.Op.like]: `%${category}%` },
            },
          },
          { model: model.status, attributes: ["status"] },
        ],
        order: [[sortby, order]],
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
  category: async (req, res, next) => {
    try {
      let get = await model.category.findAll({
        include: [{ model: model.status, attributes: ["status"] }],
      });
      res.status(200).send({
        data: get,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  addProduct: async (req, res, next) => {
    try {
      let { name, price, stock, categoryId, statusId } = JSON.parse(req.body.data);

      console.log("aaaaaaaaaaaaaaaasdada ", JSON.parse(req.body.data));

      let checkProduct = await model.product.findAll({
        where: { name: name },
      });

      if (checkProduct.length == 0) {
        console.log("req.body.data : ", req.body.data); // cek req.body in form not json
        console.log("req.files  : ", req.files); // check if file is read
        console.log("req files 2 : ", req.files[0]?.filename)

        const uuid = uuidv4();

        price = parseInt(price)
        stock = parseInt(stock)
        categoryId = parseInt(categoryId)
        statusId = parseInt(statusId)
        console.log("aaaaaaaaaaaaaaaaa", typeof (price))
        if (req.files.length == 0) {
          let create = await model.product.create({
            uuid,
            name,
            price,
            stock,
            categoryId,
            statusId,
          });
          return res.status(200).send(create);
        } else {
          let create = await model.product.create({
            uuid,
            name,
            price,
            product_image: `/imgProduct/${req.files[0]?.filename}`,
            stock,
            categoryId,
            statusId,
          });
          return res.status(200).send(create);
        }

      } else {
        return res.status(400).send("Item already exists in the store");
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  editProduct: async (req, res, next) => {
    try {
      let get = await model.product.findAll({
        where: { uuid: req.query.uuid },
        attributes: ["product_image"]
      })


      console.log("req.body.data : ", JSON.parse(req.body.data));
      console.log("req.files  : ", req.files);

      let { name, price, stock, categoryId, statusId } = JSON.parse(req.body.data);
      price = parseInt(price)
      stock = parseInt(stock)
      categoryId = parseInt(categoryId)
      statusId = parseInt(statusId)
      if (req.files.length == 0) {
        let edit = await model.product.update({
          name,
          price,
          stock,
          categoryId,
          statusId
        }, {
          where: {
            uuid: req.query.uuid
          }
        });
        return res.status(200).send({
          success: true,
          message: "Product succesfully edited"
        })
      } else {
        let edit = await model.product.update({
          name,
          price,
          product_image: `/imgProduct/${req.files[0]?.filename}`,
          stock,
          categoryId,
          statusId
        }, {
          where: {
            uuid: req.query.uuid
          }
        });

        if (fs.existsSync(`./src/public${get[0].dataValues.product_image}`) && !get[0].dataValues.product_image.includes('default')) {
          fs.unlinkSync(`./src/public${get[0].dataValues.product_image}`);
        }
        return res.status(200).send({
          success: true,
          message: 'Product succesfully edited'
        })
      }
    } catch (error) {
      console.log(error);
      next(error)
    }
  },
  status: async (req, res, next) => {
    try {
      let get = await model.status.findAll();
      res.status(200).send({
        data: get,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      let find = await model.product.findOne({
        where: { uuid: req.body.uuid },
      });

      if (!find) {
        return res.status(400).send("Product not found");
      } else {
        console.log("find data value = ", find.dataValues);
        let { uuid } = find.dataValues;
        if (find.dataValues.statusId == 2) {
          // kalo data is initially disabled
          await model.product.update(
            {
              statusId: 1,
            },
            { where: { uuid: uuid } }
          );
          return res.status(200).send("successfully recovered data");
        } else {
          await model.product.update(
            {
              statusId: 2,
            },
            { where: { uuid: uuid } }
          );
          return res.status(200).send("successfully deleted");
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  addCategory: async (req, res, next) => {
    try {
      let checkCategory = await model.category.findAll({
        where: { category: req.body.category },
      });
      if (req.body.category === "") {
        return res.status(400).send("Please fill out the form");
      }

      if (checkCategory.length == 0) {
        const { category } = req.body;
        let create = await model.category.create({
          category,
          statusId: 1,
        });
        return res.status(200).send(create);
      } else {
        return res.status(400).send("category already exists in the database");
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  editCategory: async (req, res, next) => {
    try {
      let find = await model.category.findOne({
        where: { id: req.body.id },
      });

      if (!find) {
        return res.status(400).send("Product not found");
      } else {
        if (req.body.category === "") {
          return res.status(400).send("Please fill out the form");
        } else {
          console.log("find data value = ", find.dataValues);
          let { id } = find.dataValues;
          await model.category.update(
            {
              category: req.body.category,
            },
            { where: { id: id } }
          );
          return res.status(200).send("Succesfully edited category");
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      let find = await model.category.findOne({
        where: { id: req.body.id },
      });
      if (!find) {
        return res.status(400).send("Product not found");
      } else {
        console.log("find data value = ", find.dataValues);
        let { id } = find.dataValues;
        if (find.dataValues.statusId == 2) {
          // kalo data is initially disabled
          await model.category.update(
            {
              statusId: 1,
            },
            { where: { id: id } }
          );
          return res
            .status(200)
            .send(
              `successfully recovered category = ${find.dataValues.category}`
            );
        } else {
          await model.category.update(
            {
              statusId: 2,
            },
            { where: { id: id } }
          );
          return res
            .status(200)
            .send(
              `successfully deleted category = ${find.dataValues.category}`
            );
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

};
