const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // this is just a sanity check to see that the JWT token was made 
  // (I'll remove this later as we're not necessarily worried about what the token is, more so WHEN the token expires)
  console.log('Authorization Header:', req.header("Authorization")); 

  if (!token) {
    return res.status(400).send({ message: "Authorization token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    return res.status(400).send({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
