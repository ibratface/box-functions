import { Box, Button } from "@mui/material";
import { debounce } from "lodash";
import { Session } from "../lib/session";


export default function Login() {
  const login = debounce(() => {
    Session.Current.getAuthorization()
  }, 300)

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Button variant="contained" onClick={login}>Sign in to Box</Button>
    </Box>
  )
}