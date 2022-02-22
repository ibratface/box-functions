import { Grid, Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useContext, useEffect } from 'react';
import { BoxContext } from '../../components/context';
import Header from '../../components/header';
import Login from '../../components/login';

export async function getStaticProps() {
  return {
    props: {
      boxConfig: {
        clientID: process.env.BOX_FRONTEND_CLIENT_ID,
        clientSecret: process.env.BOX_FRONTEND_CLIENT_SECRET,
        serviceAccountID: process.env.BOX_BACKEND_SERVICE_ACCOUNT_ID
      }
    }
  }
}


export default function OAuthLogin({ boxConfig }) {
  const boxContext = useContext(BoxContext)

  useEffect(() => {
    if (boxConfig) {
      boxContext.setClientID(boxConfig.clientID)
      boxContext.setClientSecret(boxConfig.clientSecret)
      boxContext.setServiceAccountID(boxConfig.serviceAccountID)
    }
  }, [boxConfig])

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '90vh' }}
    >

      <Grid item xs={3}>
        <Header></Header>
        <Box sx={{ mt: 5 }}>
          <Login />
        </Box>
        <Typography sx={{ textAlign: 'center', mt: 2 }}>
          <Link color="inherit" href="/about">What is this?</Link>
        </Typography>        
      </Grid>

    </Grid>
  )
}
