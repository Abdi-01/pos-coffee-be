const jwt = require("jsonwebtoken");

module.exports = {
  createToken: (payload, expire = "200h") => {
    let token = jwt.sign(payload, "coffee_shop", { expiresIn: expire });
    return token;
  },
  readToken: (req, res, next) => {
    jwt.verify(req.token, "coffee_shop", (error, decrypt) => {
      if (error) {
        console.log("error =", error);
        return res.status(401).send({
          success: false,
          message: "authetication failed",
          error: error,
        });
      }

      req.decrypt = decrypt; // menampung hasil penerjemahaan token ke prooperty baru
      next();
    });
  },
};
