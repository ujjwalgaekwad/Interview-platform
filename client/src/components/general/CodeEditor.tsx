import { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import LanguageSelector from '@/components/general/LanguageSelector';
import Output from './Output';
import { Button } from '../ui/button';
import { ExecuteCode } from '../../utils/ExecuteCode';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import useProfileStore from '@/store/profileStore';

interface CodeEditorProps {
    language: string;
    focus: () => void;
    getValue: () => string;
}

function CodeEditor({ addCompileAttempt }: { addCompileAttempt: ({ language, code }: { language: string, code: string }) => void }) {
    const editorRef = useRef<CodeEditorProps | null>(null);
    const [value, setValue] = useState<string>('');
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [language, setLanguage] = useState<string>('javascript')
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [output, setOutput] = useState(null);

    const { profile } = useProfileStore()

    const runCode = async () => {
        if (!editorRef.current) return

        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return
        try {
            setIsLoading(true)
            const { run: result } = await ExecuteCode(language, sourceCode);
            setOutput(result.output);
            setIsError(result.stderr ? true : false);
            addCompileAttempt({
                language: language,
                code: sourceCode,
            })
        } catch (error) {
            console.error('Error executing code:', error ? error : error);
            toast({
                variant: "destructive",
                description: 'Error executing code'
            })
        } finally {
            setIsLoading(false)
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onMountHandler = (editorValue: any) => {
        editorRef.current = editorValue;
        if (editorRef.current && typeof editorRef.current.focus === 'function') {
            editorRef.current.focus();
        }
    };

    function ChangeLanguage(language: string) {
        setLanguage(language.toLowerCase());
    }
    return (
        <div className="max-h-[80vh] h-full relative">
            <div className='flex space-x-2 pb-2'>
                <LanguageSelector language={language} ChangeLanguage={ChangeLanguage} />
                <Button onClick={() => { setIsTerminalOpen(!isTerminalOpen); runCode() }}>
                    {isLoading ? <Loader2 className='animate-spin' /> : 'Run Code'}
                </Button>
                <Button onClick={() => setIsTerminalOpen(!isTerminalOpen)}>
                    {isTerminalOpen ? 'Close Terminal' : 'Open Terminal'}
                </Button>
            </div>

            <Editor
                height="100%"
                width="100%"
                theme={profile.theme === "light" ? "vs" : "vs-dark"}
                value={value}
                onMount={onMountHandler}
                onChange={(e: string | undefined) => {
                    if (e) setValue(e);
                }}
                language={language}
                defaultValue="// Start coding here..."
            />
            {isTerminalOpen && <Output output={output || "Unsaved"} isError={isError} />}
        </div >
    );
}

export default CodeEditor
