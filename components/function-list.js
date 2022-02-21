import { Fragment, useContext, useEffect, useState } from 'react';
import { UserAccount } from '../lib/user-account';
import { BoxContext } from './context';
import { IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import FunctionCreate from './function-create';
import Link from 'next/link';
import SourceIcon from '@mui/icons-material/Source';
import DeleteIcon from '@mui/icons-material/Delete';


export default function FunctionList({ boxFolderId }) {
  const [functions, setFunctions] = useState(null)
  const boxContext = useContext(BoxContext)
  const userAccount = new UserAccount(boxContext)

  useEffect(() => {
    async function listFunctions() {
      const f = await userAccount.listFunctions()
      setFunctions(f)
    }
    if (!functions) listFunctions()
  }, [functions])

  if (!functions) return <LinearProgress></LinearProgress>

  return (
    <Fragment>
      <List sx={{ width: '100%', borderColor: 'grey.200', marginBottom: 1 }}>
        {
          functions.map(f => (
            <ListItem key={f.id} secondaryAction={
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            } disablePadding>
              <Link href={`/function/${f.id}`}>
                <ListItemButton>
                  <ListItemIcon>
                    <SourceIcon />
                  </ListItemIcon>
                  <ListItemText primary={f.name} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))
        }
      </List >
      <FunctionCreate />
    </Fragment >
  )
}
