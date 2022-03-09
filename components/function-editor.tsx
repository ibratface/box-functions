import CodeMirror from "@uiw/react-codemirror";
import { useContext, useEffect, useState } from "react";
import { debounce } from "lodash";
import { LinearProgress } from "@mui/material";
import { Session } from "../lib/session";


export default function FunctionEditor({ file, extensions, placeholder }) {
  const [text, setText] = useState(null)

  const onChange = debounce(async (value, viewUpdate) => {
    await Session.Current.updateFile(file.id, value)
  }, 1200)

  useEffect(() => {
    async function downloadFile() {
      const blob = await Session.Current.downloadFile(file.id)
      setText(blob)
    }

    if (file.id) downloadFile()
  }, [file])

  return text ? (
    <CodeMirror
      value={text}
      height="440px"
      extensions={[extensions]}
      placeholder={placeholder}
      onChange={onChange}
      theme='dark'
    />
  ) : <LinearProgress></LinearProgress>
}