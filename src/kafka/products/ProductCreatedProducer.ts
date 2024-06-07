import { BaseProducer } from "@mainmicro/jscommonlib";
import {
  ProductCreatedEvent,
  Topics,
} from "@mainmicro/jscommonlib/dist/kafka/types";
import { Kafka } from "kafkajs";
import KafkaClientInstance from "../KafkaClient";
class ProductCreatedProducer extends BaseProducer<ProductCreatedEvent> {
  protected topic: Topics.PRODUCT_CREATED = Topics.PRODUCT_CREATED;
  constructor(client: Kafka) {
    super(client);
  }
  sendMessage(message: {
    id: string;
    title: string;
    price: number;
    image: string;
    colors?: { name: string; hex: string }[] | undefined;
    sizes?: { name: string; abbreviation: string }[] | undefined;
    countInStock?: number | undefined;
  }): Promise<void> {
    return super.sendMessage(message);
  }
}

let ProductCreatedProducerInstance: ProductCreatedProducer =
  new ProductCreatedProducer(KafkaClientInstance);
export default ProductCreatedProducerInstance;
