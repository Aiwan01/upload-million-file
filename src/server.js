import express from "express";
import {mongoose} from "mongoose";
import { startConsumer } from "./worker/consumer.js";
import uploadRoute from "./routes/index.js";
import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/ecommerce")
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch(err => {
    console.error("MongoDB connection error.....", err);
  });

app.use("/api", uploadRoute);

new Worker(path.resolve(__dirname, "worker/consumer.js"));


app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce Data Ingestion Service");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  startConsumer();
});