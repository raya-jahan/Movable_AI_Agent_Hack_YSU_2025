"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [tool, setTool] = useState("gemini");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    const res = await axios.post("http://localhost:5001/api", {
      prompt
    });
    // console.log('heeel',res);
    setResponse(res.data);
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
        <option value="search">Web Search</option>
        <option value="summarize">Summarize</option>
        <option value="email">Compose Email</option>
      </select>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full max-w-xl p-3 rounded bg-gray-800 border border-gray-600"
        rows={6}
        placeholder="Enter your prompt..."
      />

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
