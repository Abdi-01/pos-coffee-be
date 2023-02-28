const { check, result, validationResult } = require("express-validator");

module.exports = {
  checkUser: async (req, res, next) => {
    try {
      if (req.path == '/regis'){
        await check("name").notEmpty().isAlphanumeric()
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
