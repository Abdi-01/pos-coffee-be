const route = require("express").Router();
const { productController } = require("../controllers");
const jwt = require("jsonwebtoken");
const { readToken } = require("../helper/jwt");
const uploader = require("../helper/uploader");

route.post("/list", readToken, productController.list);
route.get("/category", readToken, productController.category);
route.post("/add_product", readToken, uploader("/imgProduct", "CFE").array("images", 1), productController.addProduct);
route.patch("/edit_product", readToken, uploader('/imgProduct', 'PRD').array('images', 1), productController.editProduct);
route.get("/status", readToken, productController.status);
route.patch("/delete_product", readToken, productController.delete);
route.post("/add_category", readToken, productController.addCategory);
route.patch("/edit_category", readToken, productController.editCategory);
route.patch("/delete_category", readToken, productController.deleteCategory);

module.exports = route;
