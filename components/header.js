import { Box, Link } from "@mui/material";
import Head from "next/head";
import CodeIcon from '@mui/icons-material/Code';

export default function Header() {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Head>
        <title>Box Functions</title>
        <meta name="description" content="Box custom apps made easy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'start' }}>
        <CodeIcon fontSize="large" sx={{ m: 1 }} /><h1>{ "Box Functions" }</h1>
      </Box>
    </Box>
  )
}