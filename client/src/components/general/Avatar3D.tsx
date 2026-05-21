import { useEffect, useState, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./AvatarModel";

const AmbientLight = "ambientLight" as any;
const DirectionalLight = "directionalLight" as any;

export default function ModelViewer({ text }: { text: string }) {
  const [visemeStrength, setVisemeStrength] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const decayTimeoutRef = useRef<number | null>(null);
  const speechTimeoutRef = useRef<number | null>(null);
  const animationIntervalRef = useRef<number | null>(null);

  const speak = useCallback((textToSpeak: string) => {
    if (speaking && spokenText === textToSpeak) return;

    window.speechSynthesis.cancel();
    if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current);
    if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);

    setSpeaking(true);
    setSpokenText(textToSpeak);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1;
    utterance.pitch = 1.2;

    utterance.onstart = () => {
      setVisemeStrength(0.5);

      // Start interval-based lip movement (backup for missing onboundary)
      animationIntervalRef.current = window.setInterval(() => {
        setVisemeStrength(Math.random() * 0.7 + 0.3); // Simulate dynamic mouth movement
      }, 150);
    };

    utterance.onboundary = () => {
      if (!speaking) return;
      setVisemeStrength(1);
      if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current);
      decayTimeoutRef.current = window.setTimeout(() => {
        setVisemeStrength(0.3);
      }, 150);
    };

    utterance.onend = () => {
      if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current);
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);

      setVisemeStrength(0);
      setSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [speaking, spokenText]);

  useEffect(() => {
    if (text !== "No question found" && text !== spokenText) {
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = window.setTimeout(() => speak(text), 1000);
    }
    return () => {
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    };
  }, [text, spokenText, speak]);

  return (
    <div
      className="relative bg-[url('/AvatarBG.jpeg')] bg-cover bg-center h-screen overflow-hidden"
      style={{ width: "24rem", height: "19rem" }}
    >
      <div style={{ width: "25rem", height: "50rem" }}>
        <Canvas camera={{ position: [0, 3, 8], fov: 62 }}>
          <AmbientLight intensity={2} />
          <DirectionalLight position={[0, -3, 5]} intensity={1} />
          <Model visemeStrength={visemeStrength} />
          <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
        </Canvas>
      </div>
      <img src="/AvatarDesk.jpg" alt="avatar" className="absolute object-cover bottom-0 right-0" />
    </div>
  );
}
