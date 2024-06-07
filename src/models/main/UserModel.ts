import mongoose, { HydratedDocument } from "mongoose";

interface IUser {
  id: string;
  is_active: boolean;
  avatar?: string;
  first_name?: string;
  last_name?: string;
  email: string;
}
interface IUserDocument {
  id: string;
  is_active: boolean;
  avatar?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  _id?: mongoose.Types.ObjectId;
}

interface UserModelInterface extends mongoose.Model<IUserDocument> {
  createUser(user: IUser): Promise<HydratedDocument<IUserDocument>>;
}

export let UserSchema = new mongoose.Schema<IUser, UserModelInterface>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    is_active: {
      type: Boolean,
    },
    avatar: {
      type: String,
    },
    first_name: {
      type: String,
    },
    email: {
      type: String,
    },
    last_name: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

UserSchema.index({ id: 1 }, { unique: true });

UserSchema.static("createUser", async function (userData: IUser) {
  return await UserModel.create({
    ...userData,
  });
});

let UserModel = mongoose.model<IUserDocument, UserModelInterface>(
  "User",
  UserSchema
);

export default UserModel;
