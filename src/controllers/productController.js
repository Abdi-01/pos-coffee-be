const sequelize = require("sequelize");
const model = require("../models");


module.exports = {
    //1.SHOW ALL PRODUCT
    list: async(req,res,next)=>{
        try {
            console.log("ini adalah decrypt : ", req.decrypt);
            let get = await model.product.findAll({
                limit: 9
            });
            console.log("ini hasil get :", get);
            res.status(200).send(get);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

};