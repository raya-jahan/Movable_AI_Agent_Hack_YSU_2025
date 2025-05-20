"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import axios from "axios";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [tool, setTool] = useState("gemini");
  const [response, setResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleSubmit = async () => {

    
    // const res = await axios.post("http://localhost:5001/api", { prompt,tool });
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await axios.post(`${apiUrl}/api`, { prompt, tool });

    


    console.log('this is my prompt and tool',{prompt, tool});;
    setResponse(res.data);
  };

  const getVoiceInput = async () => {
    if (!isRecording) {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const audioChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          // Create a blob from the recorded audio chunks
          const audioBlob = new Blob(audioChunks, {
            type: mediaRecorder.mimeType || "audio/webm",
          });
          console.log("Recording finished, blob size:", audioBlob.size);

          // Prepare FormData to send to the backend
          const formData = new FormData();
          formData.append("file", audioBlob, "recording.mp3");
          console.log('FormData prepared for upload:', formData);

          console.log('Audio blob size:', audioBlob.size);
          try {


            const res = await axios.post(`${apiUrl}/api/upload`, formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

            
            // const res = await axios.post("http://localhost:5001/api/upload", formData, {
            //   headers: {
            //     "Content-Type": "multipart/form-data",
            //   },
            // });

            
            console.log((res.data));
            const { transcription } = res.data;
            console.log('Transcription received:', transcription);
            setPrompt(transcription);

            // setResponse("");
            handleSubmit();
          } catch (uploadError) {
            console.error("Upload error:", uploadError);
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
        console.log("Recording started");
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        console.log("Recording stopped");
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Agent</h1>

      <select
        className="mb-4 px-4 py-2 rounded bg-gray-800"
        value={tool}
        onChange={(e) => setTool(e.target.value)}
      >
        <option value="gemini">Prompt Only</option>
        <option value="search">Agent</option>
      </select>


      <p className="mt-2 mb-2">
        {isRecording ? "Recording in progress... Tap the microphone to stop and save." : "Press the microphone to start recording."}
      </p>
      <div className="w-full max-w-xl flex items-center justify-center relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full max-w-xl p-3 rounded bg-gray-800 border border-gray-600"
          rows={6}
          placeholder="Enter your prompt..."
        />
        <div className="absolute bottom-2 right-2">
          <Image
            src={isRecording ? "/microphone.png" : "/microphone-off.png"}
            alt="Microphone"
            width={24}
            height={24}
            className="filter invert cursor-pointer"
            onClick={getVoiceInput}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 px-6 py-2 rounded hover:bg-blue-600"
      >
        Submit
      </button>

      {response && (
        <div className="mt-6 w-full max-w-xl bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-bold mb-2">Response:</h2>
          <p className="whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </main>
  );
}
