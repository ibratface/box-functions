import { javascript } from "@codemirror/lang-javascript";
import { Box } from "@mui/material";
import { Fragment } from "react";
import FunctionEditor from "./function-editor";


export default function FunctionSource({ folder, file }) {
  return (
    <Fragment>
      <div>{file.name}</div>
      <Box sx={{ textAlign: 'left', border: 1, borderColor: 'text.disabled', marginTop: 1 }}>
        <FunctionEditor
          folder={folder}
          file={file}
          extensions={[javascript({ jsx: true })]}
          placeholder="Paste your app settings here"
        />
      </Box>
    </Fragment>
  )
}