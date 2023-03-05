import databaseConnection from "../config/db-config";
import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

interface UserModel
  extends Model<
    InferAttributes<UserModel>,
    InferCreationAttributes<UserModel>
  > {
  id: CreationOptional<number>;
  firstname: string;
  lastname: string;
  address: string;
  postcode: number;
  mobile: string;
  email: string;
  username: string;
  password: string;
}

const UserModel = databaseConnection.define<UserModel>("Users", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED,
  },
  firstname: {
    type: DataTypes.STRING(255),
  },
  lastname: {
    type: DataTypes.STRING(255),
  },
  address: {
    type: DataTypes.STRING(255),
  },
  postcode: {
    type: DataTypes.INTEGER(),
  },
  mobile: {
    type: DataTypes.STRING(255),
  },
  email: {
    type: DataTypes.STRING(255),
  },
  username: {
    type: DataTypes.STRING(255),
  },
  password: {
    type: DataTypes.STRING(255),
  },
});

export default UserModel;
