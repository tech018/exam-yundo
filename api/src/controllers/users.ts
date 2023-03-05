import bcrypt from "bcrypt";
import UserModel from "../models/users";
import { Response, Request } from "express";
import { ValidatedRequest } from "express-joi-validation";
import {
  DeleteRequestSchema,
  LoginRequestSchema,
  RegisterRequestSchema,
} from "../schema/usersSchema";
import { newUser } from "../interface/users";
import { generateToken } from "../utils/generateToken";
//login actions
export const loginAction = async (
  req: ValidatedRequest<LoginRequestSchema>,
  res: Response
) => {
  const { email, password } = req.body;
  try {
    const findUser = await UserModel.findOne({ where: { email } });

    if (!findUser)
      return res.status(400).json({ message: "Invalid Password or Email!" });

    const passwordIsValid = bcrypt.compareSync(password, findUser.password);

    if (!passwordIsValid)
      return res.status(400).json({ message: "Invalid Password or Email!" });

    res.status(200).json({ token: generateToken(findUser) });
  } catch (error) {
    console.log("error 500", error);
    return res.status(500).json({ message: `Internal server error`, error });
  }
};

//create new user
export const createUser = async (
  req: ValidatedRequest<RegisterRequestSchema>,
  res: Response
) => {
  const {
    firstname,
    lastname,
    address,
    postcode,
    mobile,
    email,
    password,
    username,
  } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = await bcrypt.hashSync(password, salt);

  const newUser: newUser = {
    firstname,
    lastname,
    address,
    postcode,
    mobile,
    email,
    password: hashPassword,
    username,
  };

  const findUser = await UserModel.findOne({ where: { email } });
  if (findUser)
    return res.status(400).json({ message: "User is already exist" });
  try {
    const user = await UserModel.create(newUser);

    if (user) {
      res.status(200).json({
        message: `Successfully created account ${firstname} ${lastname}`,
      });
    } else {
      res
        .status(400)
        .json({ message: `unable to register ${firstname} ${lastname}` });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//update users
export const updateUser = async (
  req: ValidatedRequest<RegisterRequestSchema>,
  res: Response
) => {
  const {
    firstname,
    lastname,
    address,
    postcode,
    mobile,
    email,
    password,
    username,
  } = req.body;
  const id = req.query.id;

  const checkEmail = await UserModel.findByPk(id);

  if (!checkEmail) {
    res.status(404).json({ message: "User not found" });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = await bcrypt.hashSync(password, salt);

  const updatedUser: newUser = {
    firstname,
    lastname,
    address,
    postcode,
    mobile,
    email,
    password: hashPassword,
    username,
  };

  try {
    const userIsUpdate = await UserModel.update(updatedUser, {
      where: {
        id,
      },
    });
    if (userIsUpdate) {
      res.status(200).json({
        message: `user ${firstname} ${lastname} is successfully updated`,
      });
    } else {
      res.status(400).json({ message: "Something wrong with the server" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//delete users
export const deleteUsers = async (
  req: ValidatedRequest<DeleteRequestSchema>,
  res: Response
) => {
  const { idList } = req.body;

  try {
    if (idList.length < 0) {
      return res.status(400).json({ message: "no selected photos" });
    } else {
      const deletedUsers = await UserModel.destroy({
        where: { id: idList },
      });
      if (deletedUsers) {
        res.status(200).json({
          message: `Successfully deleted ${
            idList.length > 1 ? "users" : "user"
          }`,
        });
      } else {
        res.status(400).json({
          message: `Unable to delete ${idList.length > 1 ? "users" : "user"}`,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//view all users
export const usersList = async (req: Request, res: Response) => {
  try {
    const listOfUsers = await UserModel.findAll();
    if (listOfUsers) {
      res.status(200).json(
        listOfUsers.map(
          ({
            username,
            email,
            address,
            postcode,
            mobile,
            firstname,
            lastname,
          }) => ({
            username,
            email,
            address,
            postcode,
            mobile,
            firstname,
            lastname,
          })
        )
      );
    } else {
      res.status(404).json({ message: "Empty user list" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
