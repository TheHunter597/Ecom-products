import mongoose from "mongoose";
export let ColorsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "This field is required."],
    },
    hex: {
      type: String,
      required: [true, "This field is required."],
      length: [7, "Ensure this field has 7 characters."],
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
