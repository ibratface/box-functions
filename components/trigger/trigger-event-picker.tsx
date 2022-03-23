import { Box, Checkbox, Chip, FormControl, InputLabel, ListItemText, ListSubheader, MenuItem, OutlinedInput, Select } from "@mui/material"
import React from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const TRIGGER_EVENTS = {
  'File': [
    'FILE.UPLOADED',
    'FILE.PREVIEWED',
    'FILE.DOWNLOADED',
    'FILE.TRASHED',
    'FILE.DELETED',
    'FILE.RESTORED',
    'FILE.COPIED',
    'FILE.MOVED',
    'FILE.LOCKED',
    'FILE.UNLOCKED',
    'FILE.RENAMED',
  ],
  'Folder': [
    'FOLDER.CREATED',
    'FOLDER.RENAMED',
    'FOLDER.DOWNLOADED',
    'FOLDER.RESTORED',
    'FOLDER.DELETED',
    'FOLDER.COPIED',
    'FOLDER.MOVED',
    'FOLDER.TRASHED',
  ],
  'Collaboration': [
    'COLLABORATION.CREATED',
    'COLLABORATION.ACCEPTED',
    'COLLABORATION.REJECTED',
    'COLLABORATION.REMOVED',
    'COLLABORATION.UPDATED',
  ],
  'Metadata': [
    'METADATA_INSTANCE.CREATED',
    'METADATA_INSTANCE.UPDATED',
    'METADATA_INSTANCE.DELETED',
  ],
  'Shared Link': [
    'SHARED_LINK.DELETED',
    'SHARED_LINK.CREATED',
    'SHARED_LINK.UPDATED',
  ],
  'Comment': [
    'COMMENT.CREATED',
    'COMMENT.UPDATED',
    'COMMENT.DELETED',
  ],
  'Task': [
    'TASK_ASSIGNMENT.CREATED',
    'TASK_ASSIGNMENT.UPDATED',
  ],
  'Webhook': [
    'WEBHOOK.DELETED',
  ],
}

export function TriggerEventChips({ events }) {
  return <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
    {events?.map((e) => (
      <Chip key={e} label={e} />
    ))}
  </Box>
}

export default function TriggerEventPicker({ events: [events, setEvents], isCreating }) {

  const handleChange = ({ target: { value: value } }) => {
    setEvents(value)
  };

  return (
    <FormControl sx={{ mt: 2, width: '100%' }}>
      <InputLabel id="demo-multiple-checkbox-label">Events</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={events}
        onChange={handleChange}
        input={<OutlinedInput label="Events" />}
        disabled={isCreating}
        renderValue={(selected) => <TriggerEventChips events={selected}></TriggerEventChips>}
        MenuProps={MenuProps}
      >
        {
          Object.keys(TRIGGER_EVENTS).map(group => [
            <ListSubheader key={group}>{group}</ListSubheader>,
            TRIGGER_EVENTS[group].map(name => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={events.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))
          ])
        }
      </Select>
    </FormControl>
  )

}