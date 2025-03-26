import "regenerator-runtime/runtime";
import useClipboard from "react-use-clipboard";
import { Button } from "../ui/button";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useState } from "react";
import { Copy, CopyCheck, Pause, Play } from "lucide-react";

const SpeechRecognitionComponent: React.FC = () => {
    const [copyText, setCopyText] = useState<string | undefined>();
    const [isCopied, setCopied] = useClipboard(copyText || '');
    const [isListening, setIsListening] = useState(false);

    const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return null;
    }

    const handleCopy = () => {  
        setCopyText(transcript);
        setCopied();
    };

    const toggleListening = () => {
        if (isListening) {
            SpeechRecognition.stopListening();
        } else {
            SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
        }
        setIsListening(!isListening);
    };

    return (
        <div>
            <div className="h-52 w-52">{transcript}</div>
            <div>
                <Button onClick={handleCopy}>
                    {isCopied ? <CopyCheck /> : <Copy />}
                </Button>
                <Button onClick={toggleListening}>
                    {isListening ? <Pause /> : <Play />}
                </Button>
            </div>
        </div>
    );
};

export default SpeechRecognitionComponent;
