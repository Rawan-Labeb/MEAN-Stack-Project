const {decodedToken} = require("../utils/jwttoken.manager");


const authorize = (requiredRole) => {
    return (req, res, next) => {
        const token = req.headers.authorization.split(" ")[1];
        const claims = decodedToken(token);

        console.log(claims.role)
        console.log(requiredRole)

  
      if (claims.role !== requiredRole) {
        return res.status(403).json({ message: "Access denied" });
      }
  
      next();
    };
  };
  
  module.exports = authorize;
  
  