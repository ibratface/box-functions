import { json } from "@codemirror/lang-json";
import { Alert, Box, debounce, LinearProgress } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { useState } from "react";
import { JWT_TEMPLATE } from "../../conf/app.config";
import { IBoxCredentialType, IBoxJsonWebToken } from "../../lib/common/box-types";


export default function FunctionCredentials({ credential, updateCredential }) {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const onChangeJWT = debounce(async (value, viewUpdate) => {
    setIsSaving(true)
    try {
      const jsonValue: IBoxJsonWebToken = JSON.parse(value)
      await updateCredential({
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
    <Box sx={{ p: 1 }}>
      {isSaving ? <LinearProgress /> : null}
      {error ? <Alert variant="filled" severity="error">{error}</Alert> : null}
      <CodeMirror
        value={credential}
        extensions={[json()]}
        onChange={onChangeJWT}
        placeholder={`// Paste your app settings here\n${JSON.stringify(JWT_TEMPLATE, null, 2)}`}
        theme='dark'
      />
    </Box>
  )
}