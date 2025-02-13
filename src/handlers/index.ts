import { Request, Response } from "express";
import slug from "slug";
import UserModel from "../models/User";
import { hashPassword } from "../utils/auth";
import { validationResult } from "express-validator";

export const createAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  // await UserModel.create(req.body); // saving data to the database, 1st way

  // handler errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;
  const userExists = await UserModel.findOne({ email });

  if (userExists) {
    const error = new Error("User already exists");
    res.status(406).json({ error: error.message });

    return;
  }

  const handle = slug(req.body.handle, ""); // creating a slug from the handle
  const handleExists = await UserModel.findOne({ handle });

  if (handleExists) {
    const error = new Error("NickName already exists");
    res.status(406).json({ error: error.message });

    return;
  }

  const user = new UserModel(req.body); // saving data to the database, 2nd way
  user.password = await hashPassword(password);
  user.handle = handle;

  console.log(slug(handle, ""));

  await user.save();

  // res.send("User created"); // sending response to the client, text
  res.status(201).json({ msg: "User created" }); // sending response to the client, json
};
