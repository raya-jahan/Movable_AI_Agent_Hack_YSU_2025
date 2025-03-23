import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import speechtoText from "../speechtoText.js";

const router = express.Router();

// Set the ffmpeg path from ffmpeg-static
ffmpeg.setFfmpegPath(ffmpegPath);

// Ensure recordings directory exists
const recordingsDir = path.join(process.cwd(), "recordings");
if (!fs.existsSync(recordingsDir)) {
  fs.mkdirSync(recordingsDir);
}

// Configure storage with Multer to store the incoming file as a temporary WebM file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, recordingsDir);
  },
  filename: (req, file, cb) => {
    // Save the file with .webm extension so ffmpeg knows the input format
    cb(null, "recording.webm");
  },
});

const upload = multer({ storage });

// POST /api/upload to handle file uploads and convert to MP3
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Input is the uploaded WebM file; output will be the converted MP3 file
  const inputPath = req.file.path; // e.g., recordings/recording.webm
  const outputPath = path.join(recordingsDir, "recording.mp3");

  ffmpeg(inputPath)
    .toFormat("mp3")
    .on("end", async () => {
      console.log("Conversion succeeded");
      console.log("Output PATH file:", outputPath);
      // Optionally delete the original WebM file if you don't need it:
      // fs.unlinkSync(inputPath);
      const transcription = await speechtoText(outputPath);
    //   console.log('prompt converted', transcription);
      res.json({
        message: "File uploaded and converted successfully",
        file: { converted: outputPath },
        transcription: transcription,
      });
    })
    .on("error", (err) => {
      console.error("Error during conversion", err);
      res.status(500).json({ error: "Conversion failed" });
    })
    .save(outputPath);
});

export default router;
