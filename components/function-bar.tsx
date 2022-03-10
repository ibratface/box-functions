import { Breadcrumbs, Button, IconButton, Link, Typography, Box } from "@mui/material";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ShareIcon from '@mui/icons-material/Share';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


export default function FunctionBar({ fn, running, onRun }) {

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'grey.300', p: 1 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
      >
        <Link underline="hover" color="inherit" href="/">Home</Link>
        <Typography>{fn?.name}</Typography>
      </Breadcrumbs>
      <div>
        <Button variant="contained" color="primary" startIcon={<ShareIcon />} disabled> Share </Button>
        <Button sx={{ ml: 2 }} variant="contained" color="primary" startIcon={<PlayCircleIcon />} onClick={onRun} disabled={running}> Run </Button>
      </div>
    </Box>
  )
}