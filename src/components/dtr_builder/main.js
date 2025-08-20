"use client"; // only if you’re using Next.js app router
import { useState } from "react";

export default function OtcTimeExtractor() {


  return (
      <iframe
        src="https://takoyaks.github.io/easy_dtr/dtr_iframe"
        title="Easy DTR"
        style={{ width: "100%", height: "80vh", border: "none", borderRadius: "8px" }}
        allowFullScreen
      >
        Your browser does not support iframes.
      </iframe>
  );
}
