import express from "express"; // ES6
import cors from "cors";
import "dotenv/config";
import router from "./router";
import { connectDB } from "./config/db";
import { corsConfig } from "./config/cors";

connectDB();

const app = express();

// Cors
app.use(cors(corsConfig));

// read data from forms
app.use(express.json());

// // catch all request for the router after a /
app.use("/", router);

app.use("/ecommerce", () => {
  console.log("from ecommerce");
});

export default app;
