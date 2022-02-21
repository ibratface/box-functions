import AddIcon from '@mui/icons-material/Add';
import { Button, Stack, TextField } from '@mui/material';
import { useRef, useContext, useState } from 'react';
import { UserAccount } from '../lib/user-account';
import { BoxContext } from './context';


export default function FunctionCreate() {
  let [expanded, setExpanded] = useState(false)
  const functionNameField = useRef();
  const boxContext = useContext(BoxContext)
  const userAccount = new UserAccount(boxContext)

  const createFunction = async (e) => {
    await userAccount.createFunction(functionNameField.current.value)
  }

  if (!expanded)
    return <Button sx={{ textAlign: 'left' }} variant="contained" endIcon={<AddIcon />} onClick={() => setExpanded(true)}> New Function </Button>
  else
    return (
      <Stack direction="row" alignItems="center" spacing={2}>
        <TextField inputRef={functionNameField} label="Function Name" variant='outlined'></TextField>
        <Button variant="contained" onClick={createFunction}> Create </Button>
        <Button variant="contained" color='secondary' onClick={() => setExpanded(false)}> Cancel </Button>
      </Stack>
    )
}