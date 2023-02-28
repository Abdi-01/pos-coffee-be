const {authController} = require('../controllers');
const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
const {readToken} = require('../helper/jwt');
const { checkUser } = require('../helper/validator');
const uploader = require('../helper/uploader');
const { login, keepLogin, list, register, edit } = require('../controllers/authController');

route.post('/', checkUser, login);
route.get('/keep_login', readToken, keepLogin);
route.get('/list', list);
route.post('/regis', checkUser, register);
route.patch('/edit', edit);

module.exports = route