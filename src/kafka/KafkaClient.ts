// import { Kafka } from "kafkajs";

// class KafkaClientSingleton {
//   private static instance: KafkaClientSingleton;
//   private client: Kafka;

//   private constructor() {
//     this.client = new Kafka({
//       clientId: "products",
//       brokers: [process.env.KAFKA_BROKER as string],
//     });
//   }

//   public static getInstance(): KafkaClientSingleton {
//     if (!KafkaClientSingleton.instance) {
//       KafkaClientSingleton.instance = new KafkaClientSingleton();
//     }

//     return KafkaClientSingleton.instance;
//   }

//   public getClient(): Kafka {
//     return this.client;
//   }
// }
// let KafkaClientInstance: KafkaClientSingleton =
//   KafkaClientSingleton.getInstance();
// export default KafkaClientInstance.getClient();

import { KafkaClientSingleton } from "@mainmicro/jscommonlib";
import { ClientId } from "@mainmicro/jscommonlib/dist/kafka/types";

let KafkaClientInstance = KafkaClientSingleton.getInstance(ClientId.PRODUCTS);

export default KafkaClientInstance;
