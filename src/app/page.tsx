"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = async () => {
      try {
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        await video.play();
      } catch (error) {
        console.log("Autoplay bloqueado:", error);
      }
    };

    const handleTimeUpdate = () => {
      if (video.currentTime >= 9) {
        video.currentTime = 0;
        void video.play();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    void tryPlay();

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const handleStart = () => {
    setIsLoading(true);

    setTimeout(() => {
      router.push("/quiz");
    }, 2400);
  };

  return (
    <>
      <main className="home-container">
        <div className="hero">
          <div className="video-stage">
            <video
              ref={videoRef}
              className="cell-video"
              autoPlay
              muted
              playsInline
              preload="auto"
              controls={false}
              disablePictureInPicture
            >
              <source src="/video/celula-3D.mp4" type="video/mp4" />
              Seu navegador não suporta vídeo.
            </video>
          </div>

          <button className="start-button" onClick={handleStart}>
            Vamos revisar ?
          </button>
        </div>
      </main>

      {isLoading && (
        <div className="loading-screen-minimal">
          <div className="loading-dot-spinner" />
        </div>
      )}
    </>
  );
}