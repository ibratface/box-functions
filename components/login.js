import { Box, Button, Container } from "@mui/material";
import { debounce } from "lodash";
import { useContext } from "react";
import { BoxContext } from "./context";
import { UserAccount } from "../lib/user-account";


export default function Login({ dog }) {
  const boxContext = useContext(BoxContext)

  const login = debounce(() => {
    const userAccount = new UserAccount(boxContext)
    window.location = userAccount.getAuthorizeUrl()
  }, 300)

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Button variant="contained" onClick={login}>Sign in to Box</Button>
    </Box>
  )
}