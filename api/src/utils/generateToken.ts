import jwt from "jsonwebtoken";

export interface generateToken {
  email: string;
  firstname: string;
  mobile: string;
  lastname: string;
}

export const generateToken = (userInfo: generateToken) => {
  const privateKey: string = `${process.env.SECRET_TOKEN}`;
  const { email, firstname, lastname, mobile } = userInfo;
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      userInfo: { email, firstname, lastname, mobile },
    },
    privateKey
  );
};
