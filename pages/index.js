import { Container } from '@mui/material';
import AuthGuard from '../components/auth-guard';
import Header from '../components/header';
import FunctionList from '../components/function-list';
import { useContext, useEffect, useState } from 'react';
import { BoxContext } from '../components/context';
import FunctionCreate from '../components/function-create';
import { Box } from '@mui/system';

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



export default function Home({ boxConfig }) {
  const boxContext = useContext(BoxContext)
  const [dateUpdated, setDateUpdated] = useState(Date.now())

  useEffect(() => {
    if (boxConfig) {
      boxContext.setClientID(boxConfig.clientID)
      boxContext.setClientSecret(boxConfig.clientSecret)
      boxContext.setServiceAccountID(boxConfig.serviceAccountID)
    }
  }, [boxConfig])

  return (
    <Container>
      <Header />
      <AuthGuard>
        <Box>
          <FunctionList boxFolderId={boxContext.userFolderId} dateUpdated={dateUpdated} setDateUpdated={setDateUpdated}></FunctionList>
          <FunctionCreate setDateUpdated={setDateUpdated} />
        </Box>
      </AuthGuard>
    </Container>
  )
}
