import { useState } from "react"
import { IoMdCopy } from "react-icons/io"
import { IoCheckmarkDoneOutline } from "react-icons/io5";

function CopyButton({ content }: { content: string }) {

  const [isCopied, setIsCopied] = useState(false)

  return (
    <button onClick={() => {
      navigator.clipboard.writeText(content)
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000);
    }} disabled={isCopied} className="py-1.5 px-2.5 bg-zinc-700/70 hover:bg-zinc-700 rounded-sm flex items-center justify-center space-x-1">
      {isCopied ? <><IoCheckmarkDoneOutline /><span>copied</span></> : <><IoMdCopy /><span>copy</span></>}
    </button>
  )
}

export default CopyButton