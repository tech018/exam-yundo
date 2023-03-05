import * as Joi from "joi";
import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export interface RegisterRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    firstname: string;
    lastname: string;
    address: string;
    postcode: number;
    mobile: string;
    email: string;
    username: string;
    password: string;
  };
}

export interface DeleteRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    idList: number[];
  };
}

export interface LoginRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    password: string;
    email: string;
  };
}

export const registerUserSchema = Joi.object({
  firstname: Joi.string().required().min(2),
  lastname: Joi.string().required().min(2),
  address: Joi.string().required(),
  mobile: Joi.string().required().min(11),
  email: Joi.string().required().email(),
  username: Joi.string().required().min(4),
  password: Joi.string().required().min(6),
  postcode: Joi.number().required(),
});

export const checkIdSchema = Joi.object({
  id: Joi.number().required(),
});

export const deleteUserSchema = Joi.object({
  idList: Joi.array().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required().min(2),
});
