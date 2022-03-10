import { json } from "@codemirror/lang-json";
import { Box } from "@mui/material";


export default function FunctionCredentials({ fn }) {
  return (
    <Box sx={{ textAlign: 'left', border: 1, borderColor: 'text.disabled', marginTop: 1 }}>
      {/* <FunctionEditor
          file={file}
          extensions={[json()]}
          placeholder="Paste your app settings here"
        /> */}
    </Box>
  )
}