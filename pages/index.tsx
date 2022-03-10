import { useEffect, useMemo, useState } from 'react';
import { Box, Container } from '@mui/material';
import AuthGuard from '../components/auth-guard';
import Header from '../components/header';
import FunctionList from '../components/function-list';
import UserContext from '../lib/user-context';


export default function Home() {
  const [folderId, setFolderId] = useState(null)

  useEffect(() => {
    setFolderId(UserContext.Current.rootFolderID)
  }, [])

  return (
    <Container>
      <AuthGuard>
        <Header />
        {folderId ? <FunctionList boxFolderId={folderId}></FunctionList> : null}
      </AuthGuard>
    </Container>
  )
}
