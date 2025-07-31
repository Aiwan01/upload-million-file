import { Router } from "express";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
 import { Worker } from "worker_threads";

const router = Router();


router.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    const ext = path.extname(req.file.originalname);

    // Delegate to worker thread
    new Worker(path.resolve(__dirname, "../../worker/fileProcessor.js"), {
        workerData: { filePath, ext },
    });

    res.status(200).send(`File processing in background`);
});



export default router;
