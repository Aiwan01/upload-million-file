import * as fs from 'fs';
import * as csv from 'fast-csv';
import * as XLSX from 'xlsx';

import { produceBatch } from '../kafka/producer.js';
import { parentPort, workerData } from "worker_threads";
const { filePath, ext } = workerData;
const batch = [];
const BATCH_SIZE = 1000;


export const parseAndInsertCsv = async () => {

     if (!workerData || !filePath || !filePath.path) {
            throw new Error("❌ This file should only be run as a worker thread.");
      }

    if (ext === "csv") {
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath.path)
                .pipe(csv.parse({ headers: true }))
                .on("data", async (row) => {
                    batch.push(row);

                    if (batch.length >= BATCH_SIZE) {
                        await produceBatch(batch);
                        batch.length = 0;
                    }
                }).on("end", async () => {
                    if (batch.length > 0) {
                        await produceBatch(batch);
                    }
                    resolve();
                }).on("error", (error) => {
                    console.error("Error reading CSV file:", error);
                    reject(error);
                });

        })

    } else if (ext === "xlsx") {
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        for (const row of data) {
            batch.push(row);
            if (batch.length >= BATCH_SIZE) {
                await produceBatch(batch);
                batch.length = 0;
            }
        }
        if (batch.length > 0) await produceBatch(batch);

    } else {
        throw new Error("Unsupported file type");
    }



}