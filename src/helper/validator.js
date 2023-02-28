const { check, validationResult } = require("express-validator");

module.exports = {
  checkUser: async (req, res, next) => {
    try {
      console.log("Request path :", req.path);
      if (req.path == '/regis'){
        await check("name").notEmpty().isAlphanumeric().run(req);
        await check("username").notEmpty().isAlphanumeric().run(req);
      } else if (req.path == '/') {
        await check("username").notEmpty().isAlphanumeric().run(req);
      }
      await check("password").notEmpty().isStrongPassword({
        minLength:6,
        minLowercase:1,
        minUppercase:1,
        minNumbers:1,
        minSymbols:0
      }).withMessage('Your password is to short or requirment are not met')
      .run(req);

      const validation = validationResult(req);
      console.log("Validation result :", validation);
      if(validation.isEmpty()){
        next();
      } else {
        return res.status(400).send({
          success: false,
          message: 'Validation invalid',
          error: validation
        })
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
