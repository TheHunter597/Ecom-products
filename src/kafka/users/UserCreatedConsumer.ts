import { Consumer, Kafka } from "kafkajs";
import UserModel from "../../models/main/UserModel";
import {
  EventsEnum,
  BaseConsumer,
  Topics,
  ProductsGroup,
} from "@mainmicro/jscommonlib";
import KafkaClientInstance from "../KafkaClient";

class UserCreatedConsumer extends BaseConsumer<EventsEnum["USER_CREATED"]> {
  protected topic: Topics.USER_CREATED = Topics.USER_CREATED;
  protected groupId: ProductsGroup.PRODUCT_USER_CREATED_GROUP =
    ProductsGroup.PRODUCT_USER_CREATED_GROUP;
  protected consumer: Consumer;
  constructor(client: Kafka) {
    super(client);
    this.consumer = this.createConsumer();
  }
  async consume() {
    await this.start();

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: any) => {
        try {
          let user = await UserModel.createUser(
            JSON.parse(message.value.toString())
          );
          console.log("User created", user);
        } catch (e) {
          console.log(e);
        }
      },
    });
  }
}

let UserCreatedConsumerInstance: UserCreatedConsumer = new UserCreatedConsumer(
  KafkaClientInstance
);
UserCreatedConsumerInstance.consume();
export default UserCreatedConsumerInstance;
