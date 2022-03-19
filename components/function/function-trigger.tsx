import { Box } from "@mui/material";
import { TriggerForm, TriggerCard } from "./trigger/trigger-form";


export default function FunctionTrigger({ triggers, createTrigger, deleteTrigger }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      { triggers?.map(t => <TriggerCard trigger={t} onDelete={deleteTrigger} key={t.id} />)}
      <TriggerForm onCreate={createTrigger} />
    </Box>
  )
}