import { Router } from "express";
import { body } from "express-validator";
import {
  createAccount,
  getUser,
  getUserByHandle,
  login,
  searchByHandle,
  updateProfile,
  uploadImage,
} from "./handlers";
import { handleInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth";

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
  handleInputErrors,
  createAccount
);

router.post(
  "/auth/login",
  body("email").isEmail().withMessage("email not valid"),
  body("password").notEmpty().withMessage("password is mandatory"),
  handleInputErrors,
  login
);

router.get("/user", authenticate, getUser);

router.patch(
  "/user",
  body("handle").notEmpty().withMessage("handle can't be empty"),
  // body("description").notEmpty().withMessage("description can't be empty"),
  handleInputErrors,
  authenticate,
  updateProfile
);

router.post("/user/image", authenticate, uploadImage);

// express read : as a dynamic route
router.get("/:handle", authenticate, getUserByHandle);

router.post(
  "/search",
  body("handle").notEmpty().withMessage("Handle can't be empty"),
  handleInputErrors,
  searchByHandle
);

export default router;
