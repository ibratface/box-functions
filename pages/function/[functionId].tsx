import { Backdrop, Box, Breadcrumbs, Button, CircularProgress, Container, Link, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import AuthGuard from "../../components/auth-guard";
import FunctionCredentials from "../../components/function/function-credentials";
import FunctionSource from "../../components/function/function-source";
import Header from "../../components/header";
import { ICredential, ITrigger, ITriggerConfig, BoxFunction } from "../../lib/client/box-function";
import TabView from "../../components/tab-view";


const useFunctionState = (functionId: string) => {
  const [fn, setFn] = useState<BoxFunction>(null)
  const [name, setName] = useState<string>()
  const [source, setSource] = useState<string>()
  const [payload, setPayload] = useState<object>()
  const [credential, setCredential] = useState<ICredential>()
  const [triggers, setTriggers] = useState<ITrigger[]>([])

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadFunction() {
      setIsLoading(true)
      const fn = await BoxFunction.load(functionId as string)
      setFn(fn)
      setName(fn.name)
      setSource(await fn.getSource())

      const settings = await fn.getSettings()
      setPayload(settings.payload)
      setCredential(settings.credential)
      setTriggers(settings.triggers)
      setIsLoading(false)
    }
    if (functionId) loadFunction()
  }, [functionId])

  async function updateSource(text: string) {
    setSource(text)
    await fn.updateSource(text)
  }

  async function updatePayload(payload: object) {
    setPayload(payload)
    await fn.updateSettings({
      payload,
      credential,
      triggers
    })
  }

  async function updateCredential(credential: ICredential) {
    setCredential(credential)    
    await fn.updateSettings({
      payload,
      credential,
      triggers
    })
  }

  async function createTrigger(config: ITriggerConfig) {
    const trigger = await fn.createTrigger(config)
    const updatedTriggers = [...triggers, trigger]
    await fn.updateSettings({
      payload,
      credential,
      triggers: updatedTriggers
    })
    setTriggers(updatedTriggers)
  }

  async function deleteTrigger(triggerId: string) {
    await fn.deleteTrigger(triggerId)
    const updatedTriggers = triggers.filter(t => t.id !== triggerId)
    await fn.updateSettings({
      payload,
      credential,
      triggers: updatedTriggers
    })
    setTriggers(updatedTriggers)
  }

  async function run() {
    return await fn.run(payload)
  }

  return { name, isLoading, source, updateSource, payload, updatePayload, credential, updateCredential, triggers, createTrigger, deleteTrigger, run }
}


export default function Function() {
  const { query: { functionId } } = useRouter()
  const fn = useFunctionState(functionId as string)

  return (
    <Container>
      <AuthGuard>
        <Header />
        {
          fn ? (
            <Fragment>
              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={fn.isLoading}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ p: 1 }}>
                <Link underline="hover" color="inherit" href="/">Home</Link>
                <Typography>Function {fn.name}</Typography>
              </Breadcrumbs>
              <TabView
                tabs={[
                  'Function',
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} key='credentials'>
                    <Typography variant='body2'> Credentials </Typography>
                    {fn.credential?.value ? null : <ErrorOutlineIcon color="error" />}
                  </Box>,
                ]}
                panels={[
                  <FunctionSource key="code"
                    run={fn.run}
                    source={fn.source}
                    updateSource={fn.updateSource}
                    payload={fn.payload}
                    updatePayload={fn.updatePayload}
                  />,
                  <FunctionCredentials key="credentials"
                    credential={fn.credential}
                    updateCredential={fn.updateCredential}
                  />]}
              />
            </Fragment>) : null
        }
      </AuthGuard>
    </Container>
  )
}