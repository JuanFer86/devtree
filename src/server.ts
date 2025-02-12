// const express = require("express"); // CommonJS
import express from "express"; // ES6
import router from "./router";

const app = express();

// catch all request for the router after a /
app.use("/", router);

app.use("/ecommerce", () => {
  console.log("from ecommerce");
});

export default app;
