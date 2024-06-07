import mongoose, {
  ClientSession,
  HydratedDocument,
  Model,
  mongo,
} from "mongoose";
import { ColorsSchema } from "../others/ColorsSubDoc";
import { SizeSchema } from "../others/SizeSubDoc";
import { FeaturesSchema } from "../others/featuresSubDoc";
import ReviewModel from "./ReviewModel";

interface IProduct {
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  countInStock: number;
  creator: mongoose.Schema.Types.ObjectId;
  rating: number;
  reviews: mongoose.Schema.Types.ObjectId[];
  tags: string[];
  colors: Array<{
    name: string;
    hex: string;
  }>;
  sizes: Array<{
    name: string;
    abbreviation: string;
  }>;
  features: Array<{
    name: string;
    description: string;
  }>;
  createdAt: string;
  updatedAt: string;
  creatorName: string;
  discount: number;
}

interface ProductModel extends Model<IProduct> {
  createProduct(
    product: IProduct,
    session: ClientSession
  ): Promise<Array<HydratedDocument<IProduct>>>;
}
let productSchema = new mongoose.Schema<IProduct, ProductModel>(
  {
    title: {
      type: String,
      required: [true, "This field is required."],
      minlength: [8, "Ensure this field has at least 8 characters."],
      maxlength: [512, "Ensure this field has at most 128 characters."],
    },
    price: {
      type: Number,
      required: [true, "This field is required."],
      min: [1, "Ensure this value is greater than or equal to 1."],
      max: [1000000, "Ensure this value is less than or equal to 1000000."],
    },
    description: {
      type: String,
      required: [true, "This field is required."],
      minlength: [20, "Ensure this field has at least 20 characters."],
      maxlength: [5000, "Ensure this field has at most 2000 characters."],
    },
    image: {
      type: String,
      required: [true, "This field is required."],
    },
    category: {
      type: String,
      required: [true, "This field is required."],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    countInStock: {
      type: Number,
      required: [true, "This field is required."],
      min: [1, "Ensure this value is greater than or equal to 1."],
      max: [1000000, "Ensure this value is less than or equal to 1000000."],
    },
    rating: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      required: [true, "This field is required."],
      validate: [
        {
          validator: (value: string[]) => {
            return value.length > 0;
          },
          message: "Ensure this field has at least 1 element.",
        },
        {
          validator: (value: string[]) => {
            for (const element of value) {
              if (element.length > 20) return false;
            }
            return true;
          },
          message: (props) => {
            for (const element of props.value) {
              if (element.length > 20)
                return `Ensure the following field ---${element}--- has at most 20 characters.`;
            }
            return "Ensure this field has at most 20 characters.";
          },
        },
      ],
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    colors: {
      type: [ColorsSchema],
      required: [true, "This field is required."],
      validate: {
        validator: (value: Array<{ name: string; hex: string }>) => {
          return value.length > 0;
        },
        message: "Ensure this field has at least 1 element.",
      },
    },
    sizes: {
      type: [SizeSchema],
      required: false,
    },
    features: {
      type: [FeaturesSchema],
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
    updatedAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
    creatorName: {
      type: String,
      required: [true, "This field is required."],
    },
    discount: {
      type: Number,
      default: 0,
      max: [99, "Ensure this value is less than or equal to 99."],
      required: false,
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

productSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date().toISOString() });

  next();
});

productSchema.pre("save", async function (next) {
  if (this.isNew) {
    let AdditionalFeatures = [
      {
        name: "Created At",
        description: this.createdAt,
      },
      {
        name: "Updated At",
        description: this.updatedAt,
      },
      {
        name: "Creator",
        description: this.creatorName,
      },
    ];
    this.features.unshift(...AdditionalFeatures);
  }
  next();
});

productSchema.post("save", async function (doc, next) {
  try {
    const aggregationResult = await ProductModel.aggregate([
      {
        $match: { _id: doc._id },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviewDetails",
        },
      },
      {
        $project: {
          rating: {
            $avg: "$reviewDetails.rating",
          },
        },
      },
    ]);
    // Update the product rating
    if (aggregationResult.length > 0 && aggregationResult[0].rating) {
      await ProductModel.findByIdAndUpdate(doc._id, {
        rating: aggregationResult[0].rating,
      });
    }
  } catch (err) {
    console.error(err);
  }
  next();
});
productSchema.pre("deleteOne", async function (next) {
  let product = await this.model.findOne(this.getQuery());

  try {
    await ReviewModel.deleteMany({ _id: { $in: product.reviews } });
    console.log("next");
  } catch (error) {
    console.log({ error });
  }
  next();
});

productSchema.static(
  "createProduct",
  async function (product: IProduct, session: ClientSession) {
    let newProduct = await ProductModel.create([product], { session });
    return newProduct;
  }
);

let ProductModel = mongoose.model<IProduct, ProductModel>(
  "Product",
  productSchema
);

export default ProductModel;
