
import CodeMirror from "@uiw/react-codemirror";
import { Box, LinearProgress } from "@mui/material";


export default function FunctionOutput({ output, running }) {
  return (
    <Box sx={{ textAlign: 'left', borderTop: 1, borderColor: 'grey.300', p: 1 }}>
      <div><strong>Output</strong></div>
      <Box sx={{ whiteSpace: "pre-line", borderColor: 'text.disabled', marginTop: 2, color: 'text.secondary' }}>
        {running ? <LinearProgress /> : null}
        {typeof output === 'string'  && !running ?
          <CodeMirror
            value={output}
            basicSetup={false}
            editable={false}
            extensions={[]}
          /> : null
        }
      </Box>
    </Box>
  )
}