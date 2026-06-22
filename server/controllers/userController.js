const router = require("express").Router();
const User = require("../../models/user");
const authMiddleware = require("../../middleware/authMiddleware");

//only if everything goes right in the authMiddleware, the callback function will be executed. If there is an error in the authMiddleware, it will send a response back to the client and the callback function will not be executed. This ensures that only authenticated users can access the resources protected by this route.
router.get("/get-logged-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId }); //The user ID is extracted from the request body (req.body.userId) and used to query the database for the corresponding user document. The findOne() method is used to retrieve a single user document that matches the specified criteria (in this case, the user ID). If a matching user is found, it will be stored in the user variable.

    res.send({
      message: "Logged in user fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.send({
      message: "Error fetching logged in user",
      error: error.message,
      success: false,
    });
  }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const allUsers = await User.find({ _id: { $ne: req.body.userId } }); //The find() method is used to retrieve all user documents from the database that do not have an _id equal to the user ID provided in the request body (req.body.userId). The $ne operator stands for "not equal" and is used to exclude the logged-in user from the list of users returned. The resulting array of user documents is stored in the users variable.

    res.send({
      message: "All users fetched successfully",
      success: true,
      data: allUsers,
    });
  } catch (error) {
    res.send({
      message: "Error fetching all users",
      error: error.message,
      success: false,
    });
  }
});

module.exports = router;
