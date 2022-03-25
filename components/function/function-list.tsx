import { useState } from 'react';
import { Avatar, Box, Card, CardHeader, IconButton, LinearProgress } from '@mui/material';
import Link from 'next/link';
import FunctionCreate from './function-create';
import { useFunctionList } from '../../lib/client/box-function';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


function FunctionCard({ fn, onDelete }) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  async function onClickDelete(ev) {
    setIsDeleting(true)
    await onDelete(fn.id)
    setIsDeleting(false)
  }

  return (
    <Card sx={{}}>
      {isDeleting ? <LinearProgress /> :
        <CardHeader
          avatar={<Avatar>fn</Avatar>}
          title={fn.name}
          subheader="description"
          action={
            <Box>
              <IconButton aria-label="edit">
                <Link href={`/function/${fn.id}`} passHref>
                  <EditIcon fontSize='small' />
                </Link >
              </IconButton>
              <IconButton aria-label="delete" onClick={onClickDelete}>
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Box>
          }
        >
        </CardHeader>
      }
    </Card >
  )
}


export default function FunctionList({ rootFolderId }) {
  const { functions, error, createFunction, deleteFunction } = useFunctionList(rootFolderId)

  if (!functions) return <LinearProgress sx={{ m: 1 }}></LinearProgress>

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {
        functions.map(f => <FunctionCard fn={f} onDelete={deleteFunction} key={f.id}></FunctionCard>)
      }
      <FunctionCreate onCreate={createFunction} />
    </Box>
  )
}
