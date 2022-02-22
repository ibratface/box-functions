import { Container } from '@mui/material';
import AuthGuard from '../components/auth-guard';
import Header from '../components/header';
import FunctionList from '../components/function-list';
import { useContext, useState } from 'react';
import { BoxContext } from '../components/context';
import FunctionCreate from '../components/function-create';
import { Box } from '@mui/system';


export default function Home() {
  const boxContext = useContext(BoxContext)
  const [dateUpdated, setDateUpdated] = useState(Date.now())

  return (
    <Container>
      <AuthGuard>
        <Header />
        <Box>
          <FunctionList boxFolderId={boxContext.userFolderId} dateUpdated={dateUpdated} setDateUpdated={setDateUpdated}></FunctionList>
          <FunctionCreate setDateUpdated={setDateUpdated} />
        </Box>
      </AuthGuard>
    </Container>
  )
}
