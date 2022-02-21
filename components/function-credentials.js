import { json } from "@codemirror/lang-json";
import { Box } from "@mui/material";
import { Fragment } from "react";
import FunctionEditor from "./function-editor";

const sample = `{
  "boxAppSettings": {
    "clientID": "abcdefghijklmnopqrstuvwxyz",
    "clientSecret": "********************************",
    "appAuth": {
      "publicKeyID": "",
      "privateKey": "",
      "passphrase": ""
    }
  },
  "enterpriseID": "123456789"
}`


export default function FunctionCredentials({ folder, file }) {
  return (
    <Fragment>
      <div>{file.name}</div>
      <Box sx={{ textAlign: 'left', border: 1, borderColor: 'text.disabled', marginTop: 1 }}>
        <FunctionEditor
          folder={folder}
          file={file}
          extensions={[json({ jsx: true })]}
          defaulttext={sample}
          placeholder="Paste your app settings here"
        />
      </Box>
    </Fragment>
  )
}