// const { users } = require('../models');
const model = require('../models');
const sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const { createToken } = require('../helper/jwt');
const fs = require('fs');
let salt = bcrypt.genSaltSync(10);

module.exports = {
    login: async (req, res, next) => {
        try {
            // console.log(model.user);
            let get = await model.user.findAll({
                attributes:["uuid", "roleId", "username"],
                where: 
                ({username: req.body.username},
                {password: req.body.password})
            })
            console.log(get[0].dataValues);
            if (get.length > 0) {

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

        } catch (error) {
            console.log(error);
            next(error)
        }
    }
    // ,
    // keepLogin: async (req, res, next) => {
    //     try {
    //         console.log("Decrypt token:", req.decrypt);
    //         let get = await model.user.findAll({
    //             where: {
    //                 uuid: req.decrypt.uuid
    //             }
    //         });
            
    //         console.log("Data dari get[0].dataValues", get[0].dataValues);

    //         let {uuid, roleId, username} = get[0].dataValues
    //         let token = createToken({uuid});

    //         return res.status(200).send({
    //             success: true,
    //             username: username,
    //             roleId: roleId,
    //             token: token
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         next(error);
    //     }
    // }
}