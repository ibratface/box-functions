import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import Link from 'next/link';
import SourceIcon from '@mui/icons-material/Source';
import DeleteIcon from '@mui/icons-material/Delete';
import { Session } from '../lib/session';
import useSWR, { mutate } from 'swr';
import FunctionCreate from './function-create';


export default function FunctionList({ boxFolderId }) {

  const { data: functions, error } = useSWR('/function', () => Session.Current.listFunctions())

  if (!functions) return <LinearProgress sx={{ m: 1 }}></LinearProgress>

  async function createFunction(name) {
    await Session.Current.createFunction(name)
    mutate('/function')
  }

  async function deleteFunction(functionId) {
    await Session.Current.deleteFunction(functionId)
    mutate('/function')
  }

  return (
    <Box>
      <List sx={{ marginBottom: 1, textAlign: 'left' }}
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            My Functions
          </ListSubheader>
        }>
        {
          functions.map(f => (
            <ListItem key={f.id} secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => deleteFunction(f.id)}>
                <DeleteIcon />
              </IconButton>
            } disablePadding>
              <Link href={`/function/${f.id}`}>
                <ListItemButton>
                  <ListItemIcon>
                    <SourceIcon />
                  </ListItemIcon>
                  <ListItemText primary={f.name} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))
        }
      </List >
      <FunctionCreate createFunction={createFunction} />
    </Box>
  )
}
