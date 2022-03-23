import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { Alert, Box, Skeleton, Typography } from "@mui/material";
import { Fragment, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { debounce } from "lodash";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { LoadingButton } from "@mui/lab";


function FunctionBar({ error, isSaving, isRunning, onRun }) {

  const buttonText = isSaving ? 'Saving' : isRunning ? 'Running' : 'Run';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row-reverse', p: 1, mt: 1 }}>
      {error ? <Alert variant="filled" severity="error" sx={{ width: "100%" }}>{error}</Alert> :
        <LoadingButton
          sx={{ ml: 2 }}
          variant="contained"
          color="primary"
          startIcon={<PlayCircleIcon />}
          onClick={onRun}
          loadingPosition="start"
          loading={isRunning || isSaving}> {buttonText}
        </LoadingButton>}
    </Box >
  )
}


function FunctionOutput({ output, isRunning }) {
  return (
    <Box sx={{ textAlign: 'left', p: 1 }}>
      <Typography variant="button">OUTPUT</Typography>
      {/* <Divider sx={{ mb: 1 }} /> */}
      <Box sx={{ whiteSpace: "pre-line", marginTop: 1, color: 'text.secondary' }}>
        {isRunning ? <Skeleton /> : null}
        {typeof output === 'string' && !isRunning ?
          <CodeMirror
            minHeight="20px"
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


export default function FunctionSource({ run, source, updateSource, payload, updatePayload }) {
  const payloadText = useRef<string>(JSON.stringify(payload, null, 2) || '')
  const [output, setOutput] = useState<string>()
  const [isRunning, setIsRunning] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string>()

  async function onRun() {
    setIsRunning(true)
    try {
      const res = await run()
      setOutput(res)
    }
    catch (e) {
      setOutput(e.message)
    }
    setIsRunning(false)
  }

  const onChangeSource = debounce(async (value, viewUpdate) => {
    if (source && source !== value) {
      setIsSaving(true)
      await updateSource(value)
      setIsSaving(false)
    }
  }, 1200)

  const onChangePayload = debounce(async (value, viewUpdate) => {
    if (payload && payload !== value) {
      setIsSaving(true)
      try {
        setError(null)        
        const jsonValue: object = JSON.parse(value)
        await updatePayload(jsonValue)
      } catch (e) {
        setError(e.message)
      }
      setIsSaving(false)
    }
  }, 1200)

  return (
    <Fragment>
      <FunctionBar error={error} isSaving={isSaving} isRunning={isRunning} onRun={onRun} />
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, p: 1 }}>
        <Box sx={{ width: '75%' }}>
          <CodeMirror
            value={source}
            height="440px"
            extensions={[javascript({ jsx: true })]}
            placeholder={`// Source Code`}
            onChange={onChangeSource}
            theme='dark'
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <CodeMirror
            value={payloadText.current}
            height="440px"
            extensions={[json()]}
            placeholder={`// Payload`}
            onChange={onChangePayload}
            theme='dark'
          />
        </Box>
      </Box>
      <FunctionOutput output={output} isRunning={isRunning} />
    </Fragment>
  )
}