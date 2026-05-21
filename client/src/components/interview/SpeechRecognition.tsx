import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Button } from "@/components/ui/button"; // Adjust import path as per your setup
import { Play, Pause } from "lucide-react";

const SpeechRecognitionBox: React.FC = () => {
    const [isListening, setIsListening] = useState(false);

    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    useEffect(() => {
        // Request microphone access with noise suppression
        navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true }
        }).catch(error => console.error("Microphone access denied:", error));
    }, []);

    if (!browserSupportsSpeechRecognition) {
        return <p className="text-red-500">Your browser does not support speech recognition.</p>;
    }

    const toggleListening = () => {
        if (isListening) {
            SpeechRecognition.stopListening();
        } else {
            SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
        }
        setIsListening(!isListening);
    };

    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            {/* Speech Display Box */}
            <div className="w-80 h-40 p-3 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-600 overflow-y-auto">
                {transcript || "Start speaking..."}
            </div>

            {/* Control Buttons */}
            <div className="flex space-x-2">
                <Button onClick={toggleListening} variant="outline">
                    {isListening ? <Pause /> : <Play />}
                    <span className="ml-2">{isListening ? "Stop" : "Start"} Listening</span>
                </Button>
                <Button onClick={resetTranscript} variant="destructive">
                    Clear
                </Button>
            </div>
        </div>
    );
};

export default SpeechRecognitionBox;
