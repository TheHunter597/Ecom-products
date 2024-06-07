import { BaseProducer } from "@mainmicro/jscommonlib";
import {
  ProductUpdatedEvent,
  Topics,
} from "@mainmicro/jscommonlib/dist/kafka/types";
import { Kafka } from "kafkajs";
import KafkaClientInstance from "../KafkaClient";
class ProductUpdatedProducer extends BaseProducer<ProductUpdatedEvent> {
  protected topic: Topics.PRODUCT_UPDATED = Topics.PRODUCT_UPDATED;
  constructor(client: Kafka) {
    super(client);
  }
  sendMessage(message: {
    id: string;
    data: {
      title: string;
      price: number;
      image: string;
      colors?: { name: string; hex: string }[] | undefined;
      sizes?: { name: string; abbreviation: string }[] | undefined;
      countInStock?: number | undefined;
    };
  }): Promise<void> {
    return super.sendMessage(message);
  }
}

let ProductUpdatedProducerInstance: ProductUpdatedProducer =
  new ProductUpdatedProducer(KafkaClientInstance);
export default ProductUpdatedProducerInstance;
