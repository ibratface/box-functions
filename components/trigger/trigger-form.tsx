import { Alert, Box, Button, debounce, Fade, Paper } from "@mui/material";
import { Fragment, useState } from "react";
import TriggerEventPicker from "./trigger-event-picker";
import TriggerTargetPicker from "./trigger-target-picker";
import { LoadingButton } from "@mui/lab";



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
        <Box>
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
        </Box>
      </Fade >
    </Fragment >
  )
}