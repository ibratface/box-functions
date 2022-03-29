import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";


export default function FunctionSettings({ deleteFunction }) {
  const [isDeleting, setIsDeleting] = useState<boolean>()
  const router = useRouter()

  async function onClickDelete(ev) {
    setIsDeleting(true)
    await deleteFunction()
    setIsDeleting(false)
    router.push('/')
  }

  return (<Box sx={{ m: 2, p: 2, textAlign: 'center' }}>
    <LoadingButton variant="outlined" color="error" onClick={onClickDelete} loading={isDeleting}>Delete</LoadingButton>
  </Box>)
}