import { Box, LinearProgress, Typography } from "@mui/material";
import { useTriggerList } from "../../lib/client/box-trigger";
import { TriggerCard } from "./trigger-card"
import { TriggerForm } from "./trigger-form";


export default function TriggerList() {
  const { triggers, error, createTrigger, deleteTrigger } = useTriggerList()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1 }}>
      {
        triggers ?
          triggers.map(t => <TriggerCard trigger={t} onDelete={deleteTrigger} key={t.id} />) :
          <LinearProgress />
      }
      <TriggerForm onCreate={createTrigger} />
    </Box>
  )
}