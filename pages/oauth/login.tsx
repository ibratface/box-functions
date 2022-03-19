import { Box, Grid, Link, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import UserContext from '../../lib/client/user-context';
import Header from '../../components/header';
import Login from '../../components/login';


export async function getStaticProps() {
  return {
    props: {
      env: {
        clientID: process.env.BOX_FRONTEND_CLIENT_ID,
        clientSecret: process.env.BOX_FRONTEND_CLIENT_SECRET,
        serviceAccountID: process.env.BOX_BACKEND_SERVICE_ACCOUNT_ID
      }
    }
  }
}


export default function OAuthLogin({ env }) {

  useEffect(() => {
    if (env) {
      const context = UserContext.Current;
      context.clientID = env.clientID
      context.clientSecret = env.clientSecret
      context.serviceAccountID = env.serviceAccountID
    }
  }, [env])

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '90vh' }
      }
    >
      <Grid item xs={3} >
        <Header/>
        < Box sx={{ mt: 5 }}>
          <Login />
        </Box>
        <Typography sx={{ textAlign: 'center', mt: 2 }}>
          <Link color="inherit" href="/about" > What is this ? </Link>
        </Typography>
      </Grid>

    </Grid>
  )
}
