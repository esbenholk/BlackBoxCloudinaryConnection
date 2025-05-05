"use client";
import { useEffect, useState } from "react";
import "../index.css"; // Import global CSS
import { Upload } from "../components/Upload";

export default function Home() {
  // const colors = ['#632bf3', '#f122c8', '#f16022', '#9ef344', '#44d3f3'];
  const [windowHeight, setWindowHeight] = useState<number>(0);
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    console.log("renders page");
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main className="brew-container">
      <img
        className="logo"
        style={{ maxWidth: windowHeight - 50 }}
        src="https://res.cloudinary.com/dmwpm8iiw/image/upload/v1741868576/logo_efs6jc.gif"
      />

      <video
        className={"couldron"}
        src={
          "https://res.cloudinary.com/dmwpm8iiw/video/upload/v1741863927/loopcouldron_svu0rw.mp4?q_auto:eco"
        }
        autoPlay
        loop
        muted
        playsInline
      />

      <img
        className={"overlay"}
        src="https://res.cloudinary.com/dmwpm8iiw/image/upload/v1741865808/couldronoverlay_bg8osp.png"
      />
      <div className="desktopborder1"></div>
      <div className="desktopborder2"></div>
      {/* <Upload /> */}
      <h1 className="notification">nyt værk på vej</h1>
    </main>
  );
}
