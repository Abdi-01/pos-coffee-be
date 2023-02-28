const {authController} = require('../controllers');
const express = require('express');
const route = express.Router();
const {readToken} = require('../helper/jwt');
const { checkUser } = require('../helper/validator');
const uploader = require('../helper/uploader');
const { login } = require('../controllers/authController');

route.post('/', login);

module.exports = route