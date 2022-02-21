import { Container } from '@mui/material';
import AuthGuard from '../components/auth-guard';
import Header from '../components/header';
import FunctionList from '../components/function-list';
import { useContext, useEffect } from 'react';
import { BoxContext } from '../components/context';

export async function getStaticProps() {
  return {
    props: {
      boxConfig: {
        clientID: process.env.BOX_FRONTEND_CLIENT_ID,
        clientSecret: process.env.BOX_FRONTEND_CLIENT_SECRET,
        redirectURI: process.env.BOX_FRONTEND_REDIRECT_URI,
        serviceAccountID: process.env.BOX_BACKEND_SERVICE_ACCOUNT_ID
      }
    }
  }
}



export default function Home({ boxConfig }) {
  const boxContext = useContext(BoxContext)

  useEffect(() => {
    if (boxConfig) {
      boxContext.setClientID(boxConfig.clientID)
      boxContext.setClientSecret(boxConfig.clientSecret)
      boxContext.setRedirectURI(boxConfig.redirectURI)
      boxContext.setServiceAccountID(boxConfig.serviceAccountID)
    }
  }, [boxConfig])

  return (
    <Container>
      <Header />
      <AuthGuard>
        <FunctionList boxFolderId={boxContext.userFolderId}></FunctionList>
      </AuthGuard>
    </Container>
  )
}
