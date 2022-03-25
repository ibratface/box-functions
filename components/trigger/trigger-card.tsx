import { Box, debounce, IconButton, Typography, Paper, LinearProgress } from "@mui/material";
import { useState } from "react";
import { TriggerEventChips } from "./trigger-event-picker";
import CloseIcon from '@mui/icons-material/Close';
import { useTrigger } from "../../lib/client/box-trigger";


export function TriggerCard({ trigger, onDelete }) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const triggerFull = useTrigger(trigger)

  const onClickDelete = debounce(async () => {
    setIsDeleting(true)
    await onDelete(trigger.id)
    setIsDeleting(false)
  }, 350)

  return (
    <Paper component="form" sx={{ display: 'flex', flexDirection: 'column', p: 1 }}>
      {
        isDeleting || !triggerFull ? <LinearProgress></LinearProgress> :
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            <Box sx={{ flexGrow: 1, p: 1 }}>
              <Typography variant="caption">EXECUTE WHEN</Typography>
              <TriggerEventChips events={triggerFull?.events} />
            </Box>
            <Box sx={{ flexGrow: 1, p: 1 }}>
              <Typography variant="caption">AT</Typography>
              <Typography variant="body2" sx={{ pt: 1 }}>{triggerFull.target.path || 'loading'}</Typography>
            </Box>
            <IconButton size="small" onClick={onClickDelete}><CloseIcon fontSize="inherit" /></IconButton>
          </Box>
      }
    </Paper>
  )
}