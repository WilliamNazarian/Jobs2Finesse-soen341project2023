
// sets up the necessary dependencies for handling JWTs and loads the environment variables required for the application to function properly.
const jwt = require('jsonwebtoken')
require('dotenv').config()
// protect routes that require authentication by verifying the JWT token in the Authorization header of incoming requests.
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
  
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({message:"Token is not valid!", accountType: "guest"});
        }
  
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You are not authenticated!");
    }
  };

module.exports = verifyJWT 
