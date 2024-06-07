import app from "./app";
import ProductCreatedProducerInstance from "./kafka/products/ProductCreatedProducer";
import ProductDeletedProducerInstance from "./kafka/products/ProductDeletedProducer";
import ProductUpdatedProducerInstance from "./kafka/products/ProductUpdatedProducer";
import UserCreatedConsumerInstance from "./kafka/users/UserCreatedConsumer";
import UserDeletedConsumerInstance from "./kafka/users/UserDeletedConsumer";
import connectDB from "./utils/connectDB";
const port = 4000;
UserCreatedConsumerInstance.consume();

connectDB().then(async () => {
  const producers = [];
  producers.push(ProductCreatedProducerInstance);
  producers.push(ProductUpdatedProducerInstance);
  producers.push(ProductDeletedProducerInstance);
  await Promise.all(producers.map((producer) => producer.start()));

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});

process.on("SIGTERM", () => {
  // Handle shutdown
  UserCreatedConsumerInstance.gracefulShutdown();
  UserDeletedConsumerInstance.gracefulShutdown();
});

process.on("SIGINT", () => {
  // Handle shutdown
  UserCreatedConsumerInstance.gracefulShutdown();
  UserDeletedConsumerInstance.gracefulShutdown();
});
