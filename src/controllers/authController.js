// const { users } = require('../models');
const model = require('../models');
const sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const { createToken } = require('../helper/jwt');
const fs = require('fs');
const {v4 : uuidv4} = require('uuid')
let salt = bcrypt.genSaltSync(10);

module.exports = {
    login: async (req, res, next) => {
        try {
            // console.log(model.user);
            let get = await model.user.findAll({
                where: 
                {username: req.body.username}
            })
            console.log(get[0].dataValues);
            if (get.length > 0) {
                if (get[0].dataValues.password == req.body.password) {
                    let {uuid, roleId, username} = get[0].dataValues
                    let token = createToken({uuid});
                    return res.status(200).send({
                        username: username,
                        roleId: roleId,
                        token: token
                    })
                } else {
                    res.status(400).send({
                        success: false,
                        message: "Login fail username or password worng"
                    })
                }
            } else {
                res.status(400).send({
                    success: false,
                    message: "Login fail username or password worng"
                })
            }

        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    keepLogin: async (req, res, next) => {
        try {
            console.log("Decrypt token:", req.decrypt);
            let get = await model.user.findAll({
                where: {
                    uuid: req.decrypt.uuid
                }
            });
            
            console.log("Data dari get[0].dataValues", get[0].dataValues);

            let {uuid, roleId, username} = get[0].dataValues
            let token = createToken({uuid});

            return res.status(200).send({
                success: true,
                username: username,
                roleId: roleId,
                token: token
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    list: async (req, res, next) => {
        try {
            let get = await model.user.findAll()
            res.status(200).send(get)
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    register: async (req, res, next) => {
        try {
            let get = await model.user.findAll({
                where: 
                {username: req.body.username}
            })

            if (get.length == 0) {
                console.log("Data sebelum hash :", req.body);
                req.body.password = bcrypt.hashSync(req.body.password, salt)
                console.log("Data setelah hash :", req.body);

                const uuid = uuidv4();
                const {name, username, password, roleId} = req.body

                let regis = await model.user.create({
                    uuid, name, username, password, roleId
                });

                return res.status(200).send({
                    success: true,
                    message: "account registered success",
                    data: regis
                })
            } else {
                return res.status(200).send({
                    success: false,
                    message: "failed to register"
                })
            }

        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}