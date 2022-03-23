import { Box, Typography } from "@mui/material";
import Head from "next/head";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Header() {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Head>
        <title>Box Functions</title>
        <meta name="description" content="Box custom apps made easy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <ArrowBackIosIcon/><Typography variant="h6">{"BOX FUNCTIONS"}</Typography><ArrowForwardIosIcon/>
      </Box>
    </Box>
  )
}