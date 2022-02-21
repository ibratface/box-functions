import { javascript } from "@codemirror/lang-javascript";
import { Box } from "@mui/material";
import { Fragment } from "react";
import FunctionEditor from "./function-editor";

const template = `
//
// Context Variables:
//   box - Box Node SDK BoxClient instance configured using your app settings
//   console - standard debugging console
//
async function execute() {
  const me = await box.users.get(box.CURRENT_USER_ID)
  console.log("Hello World, my user is:")
  console.log(me)
}

`

export default function FunctionCode({ folder, file }) {
  return (
    <Fragment>
      <div>{file.name}</div>
      <Box sx={{ textAlign: 'left', border: 1, borderColor: 'text.disabled', marginTop: 1 }}>
        <FunctionEditor
          folder={folder}
          file={file}
          extensions={[javascript({ jsx: true })]}
          defaulttext={template}
          placeholder="Paste your app settings here"
        />
      </Box>
    </Fragment>
  )
}