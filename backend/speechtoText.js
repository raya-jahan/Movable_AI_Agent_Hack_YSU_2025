import dotenv from 'dotenv';
dotenv.config();
import { readFile } from "fs/promises";

import { ElevenLabsClient, stream } from 'elevenlabs';
// import { Readable } from 'stream';

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY,
});

// const response = await fetch(
//     "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
// );


const speechtoText = async function speechToText(file) {
  // Read the file as a Buffer
  const fileBuffer = await readFile(file);
  console.log("Buffer:", fileBuffer);

  // Convert the Buffer to an ArrayBuffer
  const arrayBuffer = fileBuffer.buffer.slice(
    fileBuffer.byteOffset,
    fileBuffer.byteOffset + fileBuffer.byteLength
  );

  // Create a Blob from the ArrayBuffer (Node.js v20+ has Blob globally)
  const audioBlob = new Blob([arrayBuffer], { type: "audio/mp3" });
  
  // Now you can pass `audioBlob` to your speech-to-text conversion client
  const transcription = await client.speechToText.convert({
    file: audioBlob,
    model_id: "scribe_v1", // Currently supported model
    tag_audio_events: true,
    language_code: "eng", // Use null if you want automatic language detection
    diarize: true, // Enable speaker diarization
  });
  
  console.log("Transcription:", transcription.text);
  return transcription.text;
}

export default speechtoText;
