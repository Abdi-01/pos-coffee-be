const { check, result, validationResult } = require("express-validator");

module.exports = {
  checkUser: async (req, res, next) => {
    try {
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
