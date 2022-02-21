import CodeMirror from "@uiw/react-codemirror";
import { useContext, useEffect, useState } from "react";
import { debounce } from "lodash";
import { BoxContext } from "./context";
import { UserAccount } from "../lib/user-account";
import { LinearProgress } from "@mui/material";


export default function FunctionEditor({ file, extensions, placeholder }) {
  const boxContext = useContext(BoxContext)
  const userAccount = new UserAccount(boxContext)
  const [text, setText] = useState(null)

  const onChange = debounce(async (value, viewUpdate) => {
    await userAccount.uploadFileVersion(file.id, value)
  }, 1200)

  useEffect(() => {
    async function downloadFile() {
      const blob = await userAccount.downloadFile(file.id)
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