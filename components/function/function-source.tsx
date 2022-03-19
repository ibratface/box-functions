import { javascript } from "@codemirror/lang-javascript";
import { Box, LinearProgress } from "@mui/material";
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { debounce } from "lodash";


export default function FunctionSource({ source, updateSource }) {
  const [saving, setSaving] = useState(false)

  const onChange = debounce(async (value, viewUpdate) => {
    setSaving(true)
    await updateSource(value)
    setSaving(false)
  }, 1200)

  return (
    <Box sx={{ textAlign: 'left', border: 1, borderColor: 'text.disabled' }}>
      {!source || saving ? <LinearProgress></LinearProgress> : null}
      {source ? (<CodeMirror
        value={source}
        height="440px"
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
        theme='dark'
      />) : null}
    </Box>
  )
}