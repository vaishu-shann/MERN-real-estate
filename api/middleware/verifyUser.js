import jwt from 'jsonwebtoken';

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
