import { Request, Response } from "express";
import slug from "slug";
import UserModel from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import formidable from "formidable";
import cloudinary from "../config/cloudinary";
import { v4 as uuid } from "uuid";

export const createAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  // await UserModel.create(req.body); // saving data to the database, 1st way

  // handler errors
  // let errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   res.status(400).json({ errors: errors.array() });
  //   return;
  // }

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
    res.status(409).json({ error: error.message });

    return;
  }

  const user = new UserModel(req.body); // saving data to the database, 2nd way
  user.password = await hashPassword(password);
  user.handle = handle;

  await user.save();

  // res.send("User created"); // sending response to the client, text
  res.status(201).json({ msg: "User created" }); // sending response to the client, json
};

export const login = async (req: Request, res: Response) => {
  // handler errors
  // let errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   res.status(400).json({ errors: errors.array() });
  //   return;
  // }

  const { email, password } = req.body;

  const userExists = await UserModel.findOne({ email });

  if (!userExists) {
    const error = new Error("User not found");
    res.status(404).json({ error: error.message });

    return;
  }

  // check password
  const isPassCorrect = await checkPassword(password, userExists.password);

  if (!isPassCorrect) {
    const error = new Error("Password incorrect");
    res.status(401).json({ error: error.message });
  }

  const token = generateJWT({ id: userExists._id });

  res.status(200).json({ msg: "User logged in", token: token });
};

export const getUser = async (req: Request, res: Response) => {
  res.status(200).json(req.user);
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { description, links } = req.body;

    const handle = slug(req.body.handle, ""); // creating a slug from the handle

    const handleExists = await UserModel.findOne({ handle });

    if (handleExists && handleExists.email !== req.user.email) {
      const error = new Error("NickName already exists");
      res.status(409).json({ error: error.message });

      return;
    }

    //update user

    req.user.description = description;
    req.user.handle = handle;
    req.user.links = links;
    await req.user.save();
    res.send("Profile updated");
  } catch (e) {
    const error = new Error("it was an error");
    res.status(500).json({ error: error.message });
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const form = formidable({ multiples: false });
    form.parse(req, (error, fields, files) => {
      cloudinary.uploader.upload(
        files.file[0].filepath,
        { public_id: uuid() },
        async (error, result) => {
          if (error) {
            const error = new Error("it was an error uploading the image");
            res.status(500).json({ error: error.message });
          }

          if (result) {
            req.user.image = result.secure_url;
            await req.user.save();
            res.status(200).json({ image: result.secure_url });
          }
        }
      );
    });
  } catch (e) {
    const error = new Error("it was an error");
    res.status(500).json({ error: error.message });
  }
};

export const getUserByHandle = async (req: Request, res: Response) => {
  try {
    const { handle } = req.params;
    const user = await UserModel.findOne({ handle }).select(
      "-_id -__v -email -password"
    );
    if (!user) {
      const error = new Error("User not found");
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(200).json(user);
  } catch (e) {
    const error = new Error("it was an error");
    res.status(500).json({ error: error.message });
  }
};
