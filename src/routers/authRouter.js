const {authController} = require('../controllers');
const express = require('express');
const route = express.Router();
const {readToken} = require('../helper/jwt');
const { checkUser } = require('../helper/validator');
const uploader = require('../helper/uploader');
const { login, keepLogin, list, register } = require('../controllers/authController');

route.post('/', login);
route.get('/keep_login', readToken, keepLogin);
route.get('/list', list);
route.post('/regis', register);

module.exports = route