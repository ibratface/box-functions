import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

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

const events = [
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
  'COMMENT.CREATED',
  'COMMENT.UPDATED',
  'COMMENT.DELETED',
  'TASK_ASSIGNMENT.CREATED',
  'TASK_ASSIGNMENT.UPDATED',
  'METADATA_INSTANCE.CREATED',
  'METADATA_INSTANCE.UPDATED',
  'METADATA_INSTANCE.DELETED',
  'FOLDER.CREATED',
  'FOLDER.RENAMED',
  'FOLDER.DOWNLOADED',
  'FOLDER.RESTORED',
  'FOLDER.DELETED',
  'FOLDER.COPIED',
  'FOLDER.MOVED',
  'FOLDER.TRASHED',
  'WEBHOOK.DELETED',
  'COLLABORATION.CREATED',
  'COLLABORATION.ACCEPTED',
  'COLLABORATION.REJECTED',
  'COLLABORATION.REMOVED',
  'COLLABORATION.UPDATED',
  'SHARED_LINK.DELETED',
  'SHARED_LINK.CREATED',
  'SHARED_LINK.UPDATED'
];


export default function FunctionTrigger() {
  const [event, setEvent] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setEvent(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Box sx={{ p: 1 }}>
      <FormControl sx={{ mt: 2, display: 'flex', flexDirection: 'row', alignItems: "center" }}>
        <TextField label="Target Item" sx={{ minWidth: 240 }} disabled value='/path/to/item'></TextField>
        <Button variant="contained" sx={{ ml: 1 }} color="secondary">Choose ...</Button>
      </FormControl>
      <FormControl sx={{ mt: 2, minWidth: 360 }}>
        <InputLabel id="demo-multiple-checkbox-label">Events</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={event}
          onChange={handleChange}
          input={<OutlinedInput label="Events" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {events.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={event.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ mt: 4, minWidth: 360, display: 'block' }}>
        <Button variant="contained">Apply</Button>
      </FormControl>
    </Box>
  )
}