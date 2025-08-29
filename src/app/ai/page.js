"use client";
import { useState } from "react";

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setImage(null);

    const res = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.image) {
      setImage(data.image);
    } else {
      alert("Failed to generate image: " + data.error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Gemini Image Generator</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        className="border rounded p-2 w-full mb-4"
      />
      <button
        onClick={generateImage}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {image && (
        <div className="mt-4">
          <img src={image} alt="Generated" className="rounded-lg shadow" />
        </div>
      )}
    </div>
  );
}
