import { Breadcrumbs, Button, IconButton, Link, Typography, Box } from "@mui/material";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ShareIcon from '@mui/icons-material/Share';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { debounce } from "lodash";
import { Session } from "../lib/session";


export default function FunctionBar({ folder, setOutput, running, setRunning }) {

  const runFunction = debounce(async (e) => {
    setRunning(true)
    const res = await Session.Current.runFunction(folder.id)
    setRunning(false)
    setOutput(res)
  })

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'grey.300', p: 1 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
      >
        <Link underline="hover" color="inherit" href="/">Home</Link>
        <Typography>{folder?.name}</Typography>
      </Breadcrumbs>
      <div>
        <Button variant="contained" color="primary" startIcon={<ShareIcon />} disabled> Share </Button>
        <Button sx={{ ml: 2 }} variant="contained" color="primary" startIcon={<PlayCircleIcon />} onClick={runFunction} disabled={running}> Run </Button>
      </div>
    </Box>
  )
}