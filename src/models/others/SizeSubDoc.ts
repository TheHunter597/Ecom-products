import mongoose from "mongoose";
export let SizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "This field is required."],
      minlength: [3, "Ensure this field has at least 3 characters."],
      maxlength: [64, "Ensure this field has at most 64 characters."],
    },
    abbreviation: {
      type: String,
      required: [true, "This field is required."],
      minlength: [1, "Ensure this field has at least 1 characters."],
      maxlength: [4, "Ensure this field has at most 4 characters."],
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
