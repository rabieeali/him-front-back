const path = require("path");

const express = require("express");
const app = express();

const verifyJWT = require("../middleware/verifyJWT");

module.exports.routes = () => {

  app.use("/", require("./api/root"));
  app.use(verifyJWT);
  app.use("/employees", require("./api/employees"));


  app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
      res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
      res.json({ error: "404 Not Found" });
    } else {
      res.type("txt").send("404 Not Found");
    }
  });


}



