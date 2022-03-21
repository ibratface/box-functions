import { json } from "@codemirror/lang-json";
import { Alert, Box, debounce, LinearProgress } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { useRef, useState } from "react";
import AppConfig from "../../conf/app.config";
import { IBoxCredentialType, IBoxJsonWebToken } from "../../lib/common/box-types";


export default function FunctionCredentials({ credential, updateCredential }) {
  const text = useRef<string>(JSON.stringify(credential?.value, null, 4) || '')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const onChangeJWT = debounce((value, viewUpdate) => {
    setIsSaving(true)
    try {
      const jsonValue: IBoxJsonWebToken = JSON.parse(value)
      updateCredential({
        type: IBoxCredentialType.JWT,
        value: jsonValue
      })
      setError(null)
    } catch (e) {
      setError(e.message)
    }
    setIsSaving(false)
  }, 1200)

  return (
    <Box sx={{ textAlign: 'left', border: 1, borderColor: 'text.disabled' }}>
      {!credential || isSaving ? <LinearProgress /> : null}
      {error ? <Alert variant="filled" severity="error">{error}</Alert> : null}
      <CodeMirror
        value={text.current}
        extensions={[json()]}
        onChange={onChangeJWT}
        placeholder={`// Paste your app settings here\n${JSON.stringify(AppConfig.credential.template, null, 2)}`}
        theme='dark'
      />
    </Box>
  )
}