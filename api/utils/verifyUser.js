import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.access_token;

//   if (!token) return next(errorHandler(401, 'Unauthorized'));

//   jwt.verify(token, "jwt_secretKey", (err, user) => {
//     if (err) return next(errorHandler(403, 'Forbidden'));

//     req.user = user;
//     next();
//   });
// };


export const verifyToken = async (req, res, next) => {
  console.log("req.user",req.user)
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token,  "jwt_secretKey", (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
  console.log("decoded.user",decoded.user)

      req.user = decoded.user; 
      next();
    });

    if (!token) {
      res.status(401);
      throw new Error("User is not authorized or authToken missing");
    }
  }
}
