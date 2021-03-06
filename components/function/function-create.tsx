import { Alert, Stack, TextField } from '@mui/material';
import { useRef, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { useRouter } from 'next/router';


export default function FunctionCreate({ onCreate }) {
  const [creating, setCreating] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const functionNameField = useRef<HTMLInputElement>();
  const router = useRouter()

  const onClickCreate = async (e) => {
    setCreating(true)
    try {
      const fn = await onCreate(functionNameField.current.value)
      setError(null)
      router.push(`/function/${fn.id}`)
    }
    catch (e)
    {
      setError(e.message)
    }
    functionNameField.current.value = null
    setCreating(false)
  }

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <TextField inputRef={functionNameField} label="Function Name" variant='outlined' disabled={creating}></TextField>
      <LoadingButton
        loading={creating}
        loadingPosition="start"
        startIcon={<CreateNewFolderIcon />}
        variant="contained"
        onClick={onClickCreate}
      >
        Create
      </LoadingButton>
      {error ? <Alert variant="filled" severity="error">{error}</Alert> : null}
    </Stack>
  )
}