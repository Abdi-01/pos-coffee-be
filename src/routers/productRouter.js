const route = require("express").Router();
const { productController } = require("../controllers");    // penyederhanaan buat manggil controller
const jwt = require('jsonwebtoken');
const { readToken } = require('../helper/jwt');


route.post("/", readToken, productController.list); 

module.exports = route;