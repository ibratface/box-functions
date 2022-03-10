import { javascript } from "@codemirror/lang-javascript";
import { Box, LinearProgress } from "@mui/material";
import { Fragment, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { debounce } from "lodash";


export default function FunctionSource({ fn, text, setText }) {
  const [saving, setSaving] = useState(false)

  const onChange = debounce(async (value, viewUpdate) => {
    setSaving(true)
    await fn.updateSource(value)
    setText(value)
    setSaving(false)
  }, 1200)

  return (
    <Fragment>
      <Box sx={{ textAlign: 'left', border: 1, borderColor: 'text.disabled' }}>
        { !text || saving ? <LinearProgress></LinearProgress> : null }
        { text ? (<CodeMirror
          value={text}
          height="440px"
          extensions={[javascript({ jsx: true })]}
          onChange={onChange}
          theme='dark'
        />) : null }
      </Box>
    </Fragment>
  )
}