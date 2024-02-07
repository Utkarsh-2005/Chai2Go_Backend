import jwt from 'jsonwebtoken';


function verifyToken(req, res, next) {
    // Get token from request headers
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
  
    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);
  
    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if (err) {
            console.error(err);
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
  
        // If everything is good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
  }

export default verifyToken;