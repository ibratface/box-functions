import { CircularProgress, FormControl, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { debounce } from "lodash";
import { UserSession } from "../../lib/client/user-session";
import { getItemFullPath } from "../../lib/client/box-api";


export default function TriggerTargetPicker({ target: [item, setItem], isCreating }) {
  const [isValidating, setIsValidating] = useState<boolean>(false)
  const [itemPath, setItemPath] = useState<string>()
  const [itemError, setItemError] = useState<string>()

  const setItemState = (item, path, error) => {
    setItem(item)
    setItemPath(path)
    setItemError(error)
  }

  const onItemIDChange = debounce(async (ev) => {
    setIsValidating(true)

    const { target: { value } } = ev

    if (!value) {
      setItemState(null, null, null)
    }
    else if (value === '0') {
      setItemState(null, null, 'Trigger cannot be set on /All Files')
    }
    else if (value === '01') {
      setItemState(null, null, 'Trigger cannot be set on /Trash')
    }
    else {
      let item = null
      try {
        item = await UserSession.Current.BoxClient.getFolderInfo(value, 'id,name,type,path_collection')
      }
      catch (e) { }
      try {
        item = await UserSession.Current.BoxClient.getFileInfo(value, 'id,name,type,path_collection')
      }
      catch (e) { }

      if (item) {
        setItemState(item, getItemFullPath(item), null)
      }
      else {
        setItemState(null, null, 'Invalid item ID')
      }
    }

    setIsValidating(false)
  }, 1000)

  return (
    <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
      <TextField
        label="Item ID"
        placeholder="Item ID"
        sx={{ minWidth: 240 }}
        onChange={onItemIDChange}
        disabled={isValidating || isCreating} />
      {
        isValidating ?
          <CircularProgress sx={{ ml: 2 }}></CircularProgress> :
          itemPath ? <Typography variant="body1" sx={{ ml: 2 }}>{itemPath}</Typography> :
            itemError ? <Typography variant="body1" sx={{ ml: 2, color: 'error.main' }}>{itemError}</Typography> : null
      }
    </FormControl>
  )
}