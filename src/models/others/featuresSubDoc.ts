import mongoose from "mongoose";
export let FeaturesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "This field is required."],
      minlength: [1, "Ensure this field has at least 2 characters."],
      maxlength: [128, "Ensure this field has at most 64 characters."],
    },
    description: {
      type: String,
      required: [true, "This field is required."],
      minlength: [1, "Ensure this field has at least 2 characters."],
      maxlength: [312, "Ensure this field has at most 200 characters."],
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
