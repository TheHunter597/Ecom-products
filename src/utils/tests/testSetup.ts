import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
// This will create an new instance of "MongoMemoryServer" and automatically start it
let mongod: any;
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.JWTSECRET = "test-secret";

  await mongoose.connect(uri);
}, 20000);

beforeEach(async () => {
  const collections = mongoose.connection.collections;

  for (const collection of Object.values(collections)) {
    await collection.deleteMany({});
  }
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
}, 20000);
