// app/api/generate-image/route.js
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY, // put your Gemini API key in .env.local
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: prompt,
    });

    const part = response.candidates[0].content.parts.find(
      (p) => p.inlineData
    );

    if (!part) {
      return NextResponse.json(
        { error: "No image data returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      image: `data:image/png;base64,${part.inlineData.data}`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
