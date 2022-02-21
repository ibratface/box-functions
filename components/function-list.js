import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { UserAccount } from '../lib/user-account';
import { BoxContext } from './context';
import { IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import FunctionCreate from './function-create';
import Link from 'next/link';
import SourceIcon from '@mui/icons-material/Source';
import DeleteIcon from '@mui/icons-material/Delete';


export default function FunctionList({ boxFolderId, dateUpdated, setDateUpdated }) {
  const prevDateUpdated = useRef()
  const [functions, setFunctions] = useState(null)
  const boxContext = useContext(BoxContext)
  const userAccount = new UserAccount(boxContext)

  useEffect(() => {
    // TODO: Refresh on add
    async function listFunctions() {
      const f = await userAccount.listFunctions()
      setFunctions(f)
      prevDateUpdated.current = dateUpdated
    }
    if (prevDateUpdated.current != dateUpdated) listFunctions()
  }, [dateUpdated])

  if (!functions) return <LinearProgress sx={{ m: 1 }}></LinearProgress>

  async function deleteFunction(functionId) {
    setFunctions(functions.filter(f => f.id != functionId))
    await userAccount.deleteFunction(functionId)
    setDateUpdated(Date.now())
  }

  return (
    <List sx={{ marginBottom: 1 }}>
      {
        functions.map(f => (
          <ListItem key={f.id} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={ () => deleteFunction(f.id) }>
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
  )
}
