import { useState } from 'react';
import { Box, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import Link from 'next/link';
import SourceIcon from '@mui/icons-material/Source';
import CloseIcon from '@mui/icons-material/Close';
import FunctionCreate from './function-create';
import { useFunctionList } from '../../lib/client/box-function';


function FunctionItem({ fn, onDelete }) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  async function onClickDelete(ev) {
    setIsDeleting(true)
    await onDelete(fn.id)
    setIsDeleting(false)
  }

  return isDeleting ?
    <LinearProgress></LinearProgress> :
    <ListItem key={fn.id} secondaryAction={
      <IconButton edge="end" aria-label="delete" onClick={onClickDelete}>
        <CloseIcon />
      </IconButton>
    } disablePadding>
      <Link href={`/function/${fn.id}`} passHref>
        <ListItemButton>
          <ListItemIcon>
            <SourceIcon />
          </ListItemIcon>
          <ListItemText primary={fn.name} />
        </ListItemButton>
      </Link>
    </ListItem>
}


export default function FunctionList({ rootFolderId }) {
  const { functions, error, createFunction, deleteFunction } = useFunctionList(rootFolderId)

  if (!functions) return <LinearProgress sx={{ m: 1 }}></LinearProgress>

  return (
    <Box>
      <List sx={{ marginBottom: 1, textAlign: 'left' }}
        subheader={
          <ListSubheader component="div">
            My Functions
          </ListSubheader>
        }>
        {
          functions.map(f => <FunctionItem fn={f} onDelete={deleteFunction} key={f.id}></FunctionItem>)
        }
      </List >
      <FunctionCreate onCreate={createFunction} />
    </Box>
  )
}
