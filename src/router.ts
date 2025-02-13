import { Router } from "express";
import { body } from "express-validator";
import { createAccount } from "./handlers";

const router = Router();

// Routing
router.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("handle can't be empty"),
  body("name").notEmpty().withMessage("name can't be empty"),
  body("email").isEmail().withMessage("email not valid"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("password not valid, min 8 characters"),
  // body("password").isStrongPassword().withMessage("password not valid"),
  createAccount
);

export default router;
