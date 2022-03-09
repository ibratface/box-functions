import { Stack, TextField } from '@mui/material';
import { useRef, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';


export default function FunctionCreate({ createFunction }) {
  const [creating, setCreating] = useState(false)
  const functionNameField = useRef<HTMLInputElement>();

  const onClickCreate = async (e) => {
    setCreating(true)
    createFunction(functionNameField.current.value)
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
    </Stack>
  )
}