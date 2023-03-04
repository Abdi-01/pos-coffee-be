const route = require("express").Router();
const { transactionController } = require("../controllers");
const jwt = require("jsonwebtoken");
const { readToken } = require("../helper/jwt");

module.exports = route;

route.post("/add", readToken, transactionController.add);
