import { Box, Typography } from "@mui/material";
import Head from "next/head";

export default function Header() {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Head>
        <title>Box Functions</title>
        <meta name="description" content="Box custom apps made easy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Typography variant="h6">{"BOX FUNCTIONS"}</Typography>
      </Box>
    </Box>
  )
}