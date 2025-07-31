import { Kafka } from "kafkajs";
import Records from '../models/businessData.js';
import dotenv from "dotenv";
dotenv.config();



console.log("KAFKA_BROKER=====:", process.env.KAFKA_BROKER);
const kafka = new Kafka({ clientId: "consumer-worker", brokers: [process.env.KAFKA_BROKER] })
const consumer = kafka.consumer({ groupId: "upload-excel" });



export const startConsumer = async () => {

    await consumer.connect();
    await consumer.subscribe({ topic: "data-ingest-topic" });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const { records } = JSON.parse(message.value.toString());
            await Records.insertMany(records)
                .then(() => {
                    console.log("Records inserted successfully");
                })
                .catch((err) => {
                    console.error("Error inserting records:", err);
                });
        }
    })
}

 