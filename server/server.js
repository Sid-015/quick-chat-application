let server = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const dbconfig = require("../config/dbconfig");

const port = process.env.PORT_NUMBER;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); // using the server to listen to the request.
