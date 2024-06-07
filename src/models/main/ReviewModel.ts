import mongoose, { HydratedDocument } from "mongoose";

interface IReview {
  _id?: mongoose.Schema.Types.ObjectId;
  rating: number;
  creator: mongoose.Schema.Types.ObjectId;
  product: mongoose.Schema.Types.ObjectId;
  review: string;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
}

interface ReviewModel extends mongoose.Model<IReview> {
  createReview(reviewData: IReview): Promise<HydratedDocument<IReview>>;
}

export let ReviewSchema = new mongoose.Schema<IReview, ReviewModel>(
  {
    rating: {
      type: Number,
      min: [1, "Ensure this value is greater than or equal to 1."],
      max: [5, "Ensure this value is less than or equal to 5."],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    review: {
      type: String,
      required: [true, "This field is required."],
      minlength: [5, "Ensure this field has at least 5 characters."],
      maxlength: [2500, "Ensure this field has at most 1200 characters."],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "This field is required."],
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
    updatedAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
    image: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ReviewSchema.pre("findOneAndUpdate", async function (next) {
  this.set({ updatedAt: new Date().toISOString() });
  next();
});

ReviewSchema.static("createReview", async function (reviewData: IReview) {
  let newReview = await ReviewModel.create(reviewData);
  return newReview;
});

let ReviewModel = mongoose.model<IReview, ReviewModel>("Reviews", ReviewSchema);

export default ReviewModel;
