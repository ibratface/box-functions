import { Button, IconButton } from "@mui/material";
import { Box } from "@mui/material";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { debounce } from "lodash";
import { BoxContext } from "./context";
import { useContext } from "react";
import { UserAccount } from "../lib/user-account";
import ShareIcon from '@mui/icons-material/Share';


export default function FunctionBar({ folder, setOutput, running, setRunning }) {
  const boxContext = useContext(BoxContext)
  const userAccount = new UserAccount(boxContext)


  const runFunction = debounce(async (e) => {
    setRunning(true)
    const res = await userAccount.runFunction(folder.id)
    setRunning(false)
    setOutput(res)
  })

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'grey.300', p: 1 }}>
      {/* <div><strong>{folder?.name}</strong></div> */}
      <h3>{folder?.name}</h3>
      <div>
        <Button variant="contained" color="primary" startIcon={<ShareIcon />} disabled> Share </Button>
        <Button sx={{ ml: 2 }} variant="contained" color="primary" startIcon={<PlayCircleIcon />} onClick={runFunction} disabled={running}> Run </Button>
      </div>
    </Box>
  )
}