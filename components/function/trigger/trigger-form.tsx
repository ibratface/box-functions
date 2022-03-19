import { Alert, Box, Button, debounce, Fade, IconButton, LinearProgress, Paper, TextField, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import { getItemFullPath } from "../../../lib/client/box-api";
import TriggerEventPicker, { TriggerEventChips } from "./trigger-event-picker";
import TriggerTargetPicker from "./trigger-target-picker";
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from "@mui/lab";


interface IProps {
  trigger?: any
  onDelete: any
}


export function TriggerCard({ trigger, onDelete }: IProps) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const onClickDelete = debounce(async () => {
    setIsDeleting(true)
    await onDelete(trigger.id)
    setIsDeleting(false)
  }, 350)

  return (
    <Paper component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
      {
        isDeleting ? <LinearProgress></LinearProgress> :
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '90%' }}>
              <Typography variant="caption">Target Item</Typography>
              <TextField fullWidth variant="filled" value={getItemFullPath(trigger.target)} InputProps={{ readOnly: true }}></TextField>
              <Typography variant="caption">Events</Typography>
              <TriggerEventChips events={trigger.events} />
            </Box>
            <IconButton size="small" onClick={onClickDelete}><CloseIcon fontSize="inherit" /></IconButton>
          </Box>
      }
    </Paper>
  )
}


export function TriggerForm({ onCreate }) {
  const [expanded, setExpanded] = useState<boolean>(false)
  const [target, setTarget] = useState<any>()
  const [events, setEvents] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const onClickCreate = debounce(async _ => {
    setIsCreating(true)
    try {
      await onCreate({ target, events })
      setError(null)
      setExpanded(false)
    } catch (e) {
      setError(e.message)
    }
    setIsCreating(false)
  }, 350)

  return (
    <Fragment>
      {expanded ? null : <Button variant="outlined" onClick={() => setExpanded(true)}>+ Add Trigger</Button>}
      <Fade in={expanded}>
        <Fragment>
          {error ? <Alert variant="filled" severity="error">{error}</Alert> : null}
          <Paper sx={{ p: 2 }}>
            <TriggerTargetPicker target={[target, setTarget]} isCreating={isCreating}></TriggerTargetPicker>
            <TriggerEventPicker events={[events, setEvents]} isCreating={isCreating}></TriggerEventPicker>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row-reverse' }}>
              <Button variant="contained" onClick={() => setExpanded(false)}>Cancel</Button>
              <LoadingButton
                loading={isCreating}
                variant="contained"
                sx={{ mr: 1 }}
                disabled={!(target && events.length > 0 && true)}
                onClick={onClickCreate}>Create</LoadingButton>
            </Box>
          </Paper>
        </Fragment>
      </Fade >
    </Fragment >
  )
}