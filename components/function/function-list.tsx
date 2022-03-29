import { Avatar, Box, Card, CardHeader, IconButton, LinearProgress } from '@mui/material';
import Link from 'next/link';
import FunctionCreate from './function-create';
import { useFunctionList } from '../../lib/client/box-function';
import EditIcon from '@mui/icons-material/Edit';


function FunctionCard({ fn }) {

  return (
    <Card sx={{}}>
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
          </Box>
        }
      >
      </CardHeader>
    </Card >
  )
}


export default function FunctionList({ rootFolderId }) {
  const { functions, error, createFunction } = useFunctionList(rootFolderId)

  if (!functions) return <LinearProgress sx={{ m: 1 }}></LinearProgress>

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {
        functions.map(f => <FunctionCard fn={f} key={f.id}></FunctionCard>)
      }
      <FunctionCreate onCreate={createFunction} />
    </Box>
  )
}
