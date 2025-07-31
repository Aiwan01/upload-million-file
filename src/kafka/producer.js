import { Kafka } from "kafkajs";


import dotenv from "dotenv";
dotenv.config();


const kafka = new Kafka({ clientId: "uploader", brokers: [process.env.KAFKA_BROKER] });
const producer = kafka.producer();


export const produceBatch = async (records) => {
    try {
        await producer.connect();
        const messages = records.map((r) => ({
            value: JSON.stringify(r),
        }));


        await producer.send({
            topic: "data-ingest-topic",
            messages: messages,
        })

    } catch (error) {
        console.error("Error sending message to Kafka:", error);
    }
    finally {
        await producer.disconnect();
    }
}

