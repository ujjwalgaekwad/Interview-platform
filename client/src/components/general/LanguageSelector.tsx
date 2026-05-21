import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { languages } from "../../utils/Languages";

interface LanguageSelectorProps {
    language: string;
    ChangeLanguage: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, ChangeLanguage }) => {
    const languageEntries = Object.entries(languages);

    return (
        <div>
            <Select onValueChange={ChangeLanguage}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={language} />
                </SelectTrigger>
                <SelectContent className="flex flex-col gap-2">
                    {languageEntries.map(([languageName, languageCode]) => (
                        <SelectItem
                            key={languageCode}
                            value={languageName}

                        >
                            <span className="font-semibold">{languageName}</span>
                            <span className="ml-2 text-sm text-gray-500">{languageCode}</span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default LanguageSelector;
