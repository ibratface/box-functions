import { useState } from 'react';
import { Box, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import Link from 'next/link';
import SourceIcon from '@mui/icons-material/Source';
import CloseIcon from '@mui/icons-material/Close';
import useSWR, { mutate } from 'swr';
import FunctionCreate from './function-create';
import { BoxFunction } from '../../lib/client/box-function';
import { useRouter } from 'next/router';


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


export default function FunctionList({ boxFolderId }) {
  const router = useRouter()
  const { data: functions, error } = useSWR('/function', () => BoxFunction.list())

  if (!functions) return <LinearProgress sx={{ m: 1 }}></LinearProgress>

  async function createFunction(name) {
    const fn = await BoxFunction.create(name)
    mutate('/function')
    router.push(`/function/${fn.id}`)
    return fn
  }

  async function deleteFunction(functionId) {
    await BoxFunction.delete(functionId)
    await mutate('/function')
  }

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
