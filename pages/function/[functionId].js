import { Container } from "@mui/material";
import { Fragment, useContext, useEffect, useState } from "react";
import AuthGuard from "../../components/auth-guard";
import FunctionCredentials from "../../components/function-credentials";
import FunctionSource from "../../components/function-source";
import Header from "../../components/header";
import VerticalTabs from "../../components/vertical-tabs";
import FunctionBar from "../../components/function-bar";
import FunctionOutput from "../../components/function-output";
import { BoxContext } from "../../components/context";
import { UserAccount } from "../../lib/user-account";
import { useRouter } from "next/router";
import React from 'react';
import FunctionTrigger from "../../components/function-trigger";
import appConfig from "../../conf/app.config";


function findItem(items, name) {
  const matches = items.filter(i => i.name == name)
  return matches.length > 0 ? matches[0] : null
}


function getOrCreateFile(folderItems, folderId, filename, account, content) {
  let file = findItem(folderItems, filename)
  file = file ? file : account.uploadFile(folderId, filename, content)
  return file
}


export default function Function() {
  const boxContext = useContext(BoxContext)
  const userAccount = new UserAccount(boxContext)
  const router = useRouter()
  const { functionId } = router.query

  const [folder, setFolder] = useState(null)
  const [settingsFile, setSettingsFile] = useState({ name: appConfig.files.credentials.filename })
  const [codeFile, setCodeFile] = useState({ name: appConfig.files.source.filename })

  const [output, setOutput] = useState()
  const [running, setRunning] = useState(false)

  useEffect(() => {
    async function loadFunction() {
      const folder = await userAccount.getFunctionInfo(functionId)
      setFolder(folder)
      const folderItems = await userAccount.listFunctionFiles(folder.id)
      setSettingsFile(getOrCreateFile(folderItems, folder.id, settingsFile.name, userAccount, appConfig.files.credentials.filename))
      setCodeFile(getOrCreateFile(folderItems, folder.id, codeFile.name, userAccount, appConfig.files.source.filename))
    }
    if (functionId) loadFunction()
  }, [functionId])

  return (
    <Container>
      <AuthGuard>
      <Header />
        {
          folder ? (
            <Fragment>
              <FunctionBar folder={folder} setOutput={setOutput} running={running} setRunning={setRunning} />
              <VerticalTabs
                tabs={['App Credentials', 'Source', 'Webhooks (WIP)', "Security (WIP)"]}
                panels={[
                  <FunctionCredentials folder={folder} file={settingsFile} key="credentials" />,
                  <FunctionSource folder={folder} file={codeFile} key="code" />,
                  <FunctionTrigger key="trigger" />,
                  "Look away! I'm not ready!"]} />
              <FunctionOutput output={output} running={running} />
            </Fragment>) : null
        }
      </AuthGuard>
    </Container>
  )
}