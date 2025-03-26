import { useEffect, useState, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./AvatarModel";

export default function ModelViewer({ text }: { text: string }) {
  const [visemeStrength, setVisemeStrength] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const decayTimeoutRef = useRef<number | null>(null);
  const speechTimeoutRef = useRef<number | null>(null);

  const speak = useCallback((textToSpeak: string) => {
    // If already speaking the same text, do nothing
    if (speaking && spokenText === textToSpeak) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    if (decayTimeoutRef.current) {
      clearTimeout(decayTimeoutRef.current);
      decayTimeoutRef.current = null;
    }

    setSpeaking(true);
    setSpokenText(textToSpeak);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    utterance.onstart = () => {
      // Start with an initial viseme strength (mouth partially open)
      setVisemeStrength(0.5);
    };

    utterance.onboundary = () => {
      // Only animate lips if we're currently speaking
      if (!speaking) return;
      setVisemeStrength(1);
      if (decayTimeoutRef.current) {
        clearTimeout(decayTimeoutRef.current);
      }
      decayTimeoutRef.current = window.setTimeout(() => {
        setVisemeStrength(0);
      }, 150);
    };

    utterance.onend = () => {
      if (decayTimeoutRef.current) {
        clearTimeout(decayTimeoutRef.current);
        decayTimeoutRef.current = null;
      }
      setVisemeStrength(0);
      setSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [speaking, spokenText]);

  useEffect(() => {
    if (text !== "No question found" && text !== spokenText) {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      speechTimeoutRef.current = window.setTimeout(() => {
        speak(text);
      }, 4000);
    }
    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  }, [text, spokenText, speak]);

  return (
    <div
      className="relative bg-gray-800 overflow-hidden"
      style={{ width: "30rem", height: "30rem" }}
    >
      <div style={{ width: "30rem", height: "95rem" }}>
        <Canvas camera={{ position: [0, 3, 8], fov: 62 }}>
          <ambientLight intensity={2} />
          <directionalLight position={[0, -3, 5]} intensity={1} />
          <Model visemeStrength={visemeStrength} speaking={speaking} />
          <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
        </Canvas>
      </div>
    </div>
  );
}
