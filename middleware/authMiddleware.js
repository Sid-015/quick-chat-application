//Will modify or manipulate the request object to add the user info to it, so that the controller can use it to perform the necessary operations.
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extract the token from the Authorization header. The expected format is "Bearer <token>".
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // Verify the token using the secret key. If the token is valid, it will return the decoded payload.

    if (!req.body) req.body = {}; // Ensure req.body is defined to avoid errors when assigning userId.
    req.body.userId = decodedToken.userId; // Add the user ID from the decoded token to the request body. This allows the controller to identify the user making the request.
    // Log the decoded token for debugging purposes.
    next(); // Call the next middleware function in the stack.
  } catch (err) {
    res.send({
      message: "Unauthorized access!!!",
      error: err.message,
      success: false,
      info: req.body,
    });
  }
};
