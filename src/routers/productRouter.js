const route = require("express").Router();
const { productController } = require("../controllers");  
const jwt = require('jsonwebtoken');
const { readToken } = require('../helper/jwt');


route.post("/list", readToken, productController.list); 

module.exports = route;