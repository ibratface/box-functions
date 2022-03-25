import { Box, LinearProgress } from "@mui/material";
import { TriggerCard } from "./trigger-card"
import { TriggerForm } from "./trigger-form";


export default function TriggerList({ triggers, createTrigger, deleteTrigger }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1 }}>
      {
        triggers ?
          triggers.map(t =>
            <TriggerCard key={t.id}
              trigger={t}
              onDelete={deleteTrigger} />) :
          <LinearProgress />
      }
      <TriggerForm onCreate={createTrigger} />
    </Box>
  )
}