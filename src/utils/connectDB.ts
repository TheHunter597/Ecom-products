import mongoose from "mongoose";

export default async function connectDB() {
  const username = process.env.MONGO_INITDB_ROOT_USERNAME;
  const password = process.env.MONGO_INITDB_ROOT_PASSWORD;
  const host = process.env.MONGO_HOST;
  if (!username || !password || !host) {
    throw new Error("Please provide username, password and host for MongoDB");
  }
  while (true) {
    try {
      await mongoose.connect(
        `mongodb://${username}:${password}@${host}:27017/products`
      );
      console.log("MongoDB connected");
      break;
    } catch (error) {
      console.error("MongoDB connection failed, retrying in 5 seconds");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}
