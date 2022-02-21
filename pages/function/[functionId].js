import { Container } from "@mui/material";
import { Fragment, useContext, useEffect, useState } from "react";
import AuthGuard from "../../components/auth-guard";
import FunctionCredentials from "../../components/function-credentials";
import FunctionCode from "../../components/function-code";
import Header from "../../components/header";
import VerticalTabs from "../../components/vertical-tabs";
import FunctionBar from "../../components/function-bar";
import FunctionOutput from "../../components/function-output";
import { BoxContext } from "../../components/context";
import { UserAccount } from "../../lib/user-account";
import { useRouter } from "next/router";
import React from 'react';
import FunctionTrigger from "../../components/function-trigger";


const default_settings = `{
  "boxAppSettings": {
    "clientID": "abcdefghijklmnopqrstuvwxyz",
    "clientSecret": "********************************",
    "appAuth": {
      "publicKeyID": "",
      "privateKey": "",
      "passphrase": ""
    }
  },
  "enterpriseID": "123456789"
}`

const default_function = `export default function execute(context) {

}
`

function findItem(items, name) {
  const matches = items.filter(i => i.name == name)
  return matches.length > 0 ? matches[0] : null
}


function getOrCreateFile(folderItems, folderId, filename, account) {
  let file = findItem(folderItems, filename)
  file = file ? file : account.uploadFile(folderId, filename, default_settings)
  return file
}


export default function Function() {
  const boxContext = useContext(BoxContext)
  const userAccount = new UserAccount(boxContext)
  const router = useRouter()
  const { functionId } = router.query

  const [folder, setFolder] = useState(null)
  const [settingsFile, setSettingsFile] = useState({ name: 'settings.json' })
  const [codeFile, setCodeFile] = useState({ name: 'function.js' })

  const [output, setOutput] = useState()
  const [running, setRunning] = useState(false)

  useEffect(() => {
    async function loadFunction() {
      const folder = await userAccount.getFunctionInfo(functionId)
      setFolder(folder)
      const folderItems = await userAccount.listFunctionFiles(folder.id)
      setSettingsFile(getOrCreateFile(folderItems, folder.id, settingsFile.name, userAccount))
      setCodeFile(getOrCreateFile(folderItems, folder.id, codeFile.name, userAccount))
    }    
    if (functionId) loadFunction()
  }, [functionId])

  return (
    <Container>
      <Header />
      <AuthGuard>
        {
          folder ? (
            <Fragment>
              <FunctionBar folder={folder} setOutput={setOutput} running={running} setRunning={setRunning} />
              <VerticalTabs
                tabs={['App Settings', 'Code', 'Triggers (WIP)', "Security (WIP)"]}
                panels={[
                  <FunctionCredentials folder={folder} file={settingsFile} key="credentials" />,
                  <FunctionCode folder={folder} file={codeFile} key="code" />,
                  <FunctionTrigger key="trigger" />,
                  "Look away! I'm not ready!"]} />
              <FunctionOutput output={output} running={running} />
            </Fragment>) : null
        }
      </AuthGuard>
    </Container>
  )
}