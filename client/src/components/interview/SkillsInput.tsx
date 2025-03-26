import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SkillsInput({ value = [], onChange }: { value: string[]; onChange: (skills: string[]) => void }) {
  const [inputValue, setInputValue] = useState("");

  const addSkill = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeSkill = (skill: string) => {
    onChange(value.filter((s) => s !== skill));
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a skill..."
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
        />
        <Button type="button" onClick={addSkill}>
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((skill) => (
          <span key={skill} className="text-black dark:text-white border-[1px] text-sm border-zinc-700 px-2.5 py-1 rounded-md flex items-center">
            {skill}
            <button type="button" className="ml-2 text-zinc-900 dark:text-zinc-100" onClick={() => removeSkill(skill)}>
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default SkillsInput;
