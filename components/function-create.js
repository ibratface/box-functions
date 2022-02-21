import { Stack, TextField } from '@mui/material';
import { useRef, useContext, useState } from 'react';
import { UserAccount } from '../lib/user-account';
import { BoxContext } from './context';
import LoadingButton from '@mui/lab/LoadingButton';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import appConfig from '../conf/app.config';


export default function FunctionCreate({ setDateUpdated }) {
  const [creating, setCreating] = useState(false)
  const functionNameField = useRef();
  const boxContext = useContext(BoxContext)
  const userAccount = new UserAccount(boxContext)

  const createFunction = async (e) => {
    setCreating(true)
    const func = await userAccount.createFunction(functionNameField.current.value)
    await userAccount.uploadFile(func.id, appConfig.files.credentials.filename, appConfig.files.credentials.template)
    await userAccount.uploadFile(func.id, appConfig.files.source.filename, appConfig.files.source.template)
    functionNameField.current.value = null
    setDateUpdated(Date.now())
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
        onClick={createFunction}
      >
        Create
      </LoadingButton>
    </Stack>
  )
}