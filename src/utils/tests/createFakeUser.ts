import jwt from "jsonwebtoken";
import UserModel from "../../models/main/UserModel";
import { randomBytes } from "crypto";
export default async function createFakeUser(
  userData: {
    id: string;
    is_active: boolean;
    account_confirmed?: boolean;
    email: string;
  } = {
    id: randomBytes(16).toString("hex"),
    is_active: true,
    account_confirmed: true,
    email: "test@gmail.com",
  }
) {
  let newUser = await UserModel.createUser(userData);
  let token = jwt.sign(
    {
      user_id: newUser.id,
      ...userData,
    },
    process.env.JWTSECRET as string
  );
  return {
    token,
    newUser,
  };
}
