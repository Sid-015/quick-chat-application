//This file will handle all login and signup requests.

const router = require("express").Router(); // Allows to handle multiple type of requests (get, post, put, delete)
const User = require("../../models/user"); // Import the user model to interact with the database
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token generation

router.post("/signup", async (req, res) => {
  // Handle user signup logic here
  try {
    //If user already exists, throw an error
    const user = await User.findOne({ email: req.body.email });

    //if user exists, send a response back to the client indicating that the user already exists. The response includes a message and a success flag set to false. This allows the client to understand that the signup attempt was unsuccessful due to the existing user.
    if (user) {
      return res.status(400).send({
        message: "User already exists",
        success: false,
      }); //res.send() is used to send a response back to the client. It can send various types of data, such as strings, objects, or arrays. In this case, it sends an object containing a message and a success flag through a JSON object. The client can then parse this response to understand the result of the signup attempt.
    }

    //encrypt the password entered by user.
    const hashedPassword = await bcrypt.hash(req.body.password, 10); //The second argumnet is the salt value, which determines the computational cost of hashing. A higher salt value increases the time it takes to hash the password, making it more secure against brute-force attacks. In this case, a salt value of 10 is commonly used and provides a good balance between security and performance.
    req.body.password = hashedPassword; //The hashed password is then assigned back to the req.body.password, replacing the original plaintext password. This ensures that when the user data is saved to the database, it will store the hashed version of the password instead of the plaintext version, enhancing security.
    //Create a new user and save in DB.

    await new User(req.body).save();
    //This line creates a new instance of the user model using the data from req.body, which contains the user's information including the hashed password. The save() method is then called on this instance to save the user data to the database. This operation is asynchronous, and it will store the user's information securely in the database, including the hashed password instead of the plaintext version.

    return res.status(201).send({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    res.send("Error during signup: " + error.message);
  }

  res.send("Signup endpoint");
});

router.post("/login", async (req, res) => {
  // Handle user login logic here
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password",
    ); //explicitly select password field from the database, even if it is not included in the default selection. This allows the application to retrieve the hashed password for the user during the login process, which is necessary for comparing it with the password entered by the user.
    //if user not found, send a reponse back saying user was not find.
    if (!user) {
      return res.send({
        message: "User not found",
        success: false,
      });
    }

    //If user exists, compare the password entered by user with the hashed password stored in DB.
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password,
    ); //The bcrypt.compare() function takes the plaintext password entered by the user (req.body.password) and the hashed password stored in the database (user.password). It compares the two and returns a boolean value indicating whether they match or not. If the passwords match, it means the user has entered the correct password, and if they don't match, it indicates an incorrect password.

    if (!isPasswordValid) {
      return res.send({
        message: "Invalid password",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    }); //The jwt.sign() function is used to generate a JSON Web Token (JWT) for the authenticated user. It takes three arguments: the payload, the secret key, and an optional configuration object. In this case, the payload contains the userId (user._id) which is typically used to identify the user in subsequent requests. The secret key (process.env.SECRET_KEY) is used to sign the token and ensure its integrity. The expiresIn option specifies the expiration time for the token, in this case, it is set to "1d" which means the token will expire after 1 day.
    res.send({
      message: "Login successful",
      success: true,
      token: token,
    }); //If password valid, return a JWT token to the client. The token can be used for subsequent authenticated requests to access protected routes or resources. The token typically contains encoded information about the user, such as their ID or email, and is signed with a secret key to ensure its integrity and authenticity.
  } catch (error) {
    res.send("Error during login: " + error.message);
  }
});

module.exports = router;
