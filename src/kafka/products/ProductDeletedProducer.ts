import { BaseProducer } from "@mainmicro/jscommonlib";
import {
  ProductDeletedEvent,
  ProductUpdatedEvent,
  Topics,
} from "@mainmicro/jscommonlib/dist/kafka/types";
import { Kafka } from "kafkajs";
import KafkaClientInstance from "../KafkaClient";
class ProductDeletedProducer extends BaseProducer<ProductDeletedEvent> {
  protected topic: Topics.PRODUCT_DELETED = Topics.PRODUCT_DELETED;
  constructor(client: Kafka) {
    super(client);
  }
  sendMessage(message: { id: string }): Promise<void> {
    return super.sendMessage(message);
  }
}

let ProductDeletedProducerInstance: ProductDeletedProducer =
  new ProductDeletedProducer(KafkaClientInstance);
export default ProductDeletedProducerInstance;
