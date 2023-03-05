import express from "express";
import { createValidator } from "express-joi-validation";
import verifyToken from "../utils/verifyToken";
const validator = createValidator();
const router = express.Router();

import {
  createUser,
  updateUser,
  deleteUsers,
  usersList,
  loginAction,
} from "../controllers/users";
import {
  registerUserSchema,
  checkIdSchema,
  deleteUserSchema,
  loginUserSchema,
} from "../schema/usersSchema";
router
  .route("/")
  .put(
    verifyToken,
    validator.query(checkIdSchema),
    validator.body(registerUserSchema),
    updateUser
  )
  .post(validator.body(loginUserSchema), loginAction);

router.route("/register").post(validator.body(registerUserSchema), createUser);
router.route("/allusers").get(verifyToken, usersList);
router
  .route("/delete")
  .post(verifyToken, validator.body(deleteUserSchema), deleteUsers);

export default router;
