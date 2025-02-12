// const express = require("express"); // CommonJS
import server from "./server";

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log("server working in the port... ", port);
});
