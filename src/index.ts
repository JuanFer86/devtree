// const express = require("express"); // CommonJS
import colors from "colors";
import server from "./server";

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(colors.blue.bold("server working in the port... " + port));
});
