import { Consumer, Kafka } from "kafkajs";
import UserModel from "../../models/main/UserModel";
import {
  EventsEnum,
  BaseConsumer,
  Topics,
  ProductsGroup,
} from "@mainmicro/jscommonlib";
import KafkaClientInstance from "../KafkaClient";

class UserDeletedConsumer extends BaseConsumer<EventsEnum["USER_DELETED"]> {
  protected topic: Topics.USER_DELETED = Topics.USER_DELETED;
  protected groupId: ProductsGroup.PRODUCT_USER_DELETED_GROUP =
    ProductsGroup.PRODUCT_USER_DELETED_GROUP;
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
          let data = JSON.parse(message.value.toString());

          let userToUpdate = await UserModel.findOneAndUpdate(data.user_id);
          if (!userToUpdate) {
            console.log("User not found");
            return;
          }
          userToUpdate.is_active = data.data.is_active;
          await userToUpdate?.save();
          console.log("User Deactivated", userToUpdate);
        } catch (e) {
          console.log(e);
        }
      },
    });
  }
}

let UserDeletedConsumerInstance: UserDeletedConsumer = new UserDeletedConsumer(
  KafkaClientInstance
);
UserDeletedConsumerInstance.consume();
export default UserDeletedConsumerInstance;
