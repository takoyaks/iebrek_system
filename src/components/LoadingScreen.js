"use client";

import { useEffect, useRef } from "react";
import lottie from "lottie-web";

export default function LoadingScreen() {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;

    const instance = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/animations/loading.json", // ✅ load from public
    });

    return () => instance.destroy();
  }, []);

  return (
    
<div
  style={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  }}
>
  <div
    ref={container}
    className="floating-box"
    style={{
      width: 150,
      height: 150,
      background: "#fff",
      borderRadius: 10,
      padding: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    }}
  ></div>

  <style jsx>{`
    @keyframes float {
      0% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-15px);
      }
      100% {
        transform: translateY(0px);
      }
    }

    .floating-box {
      animation: float 3s ease-in-out infinite;
    }
  `}</style>
</div>

  );
}
