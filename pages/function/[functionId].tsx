import { Backdrop, Badge, Box, Breadcrumbs, Button, CircularProgress, Container, LinearProgress, Link, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import CodeMirror from "@uiw/react-codemirror";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ShareIcon from '@mui/icons-material/Share';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import AuthGuard from "../../components/auth-guard";
import FunctionCredentials from "../../components/function/function-credentials";
import FunctionSource from "../../components/function/function-source";
import Header from "../../components/header";
import VerticalTabs from "../../components/vertical-tabs";
import FunctionTrigger from "../../components/function/function-trigger";
import { ICredential, ITrigger, ITriggerConfig, BoxFunction } from "../../lib/client/box-function";


const useFunctionState = (functionId: string) => {
  const [fn, setFn] = useState<BoxFunction>(null)
  const [name, setName] = useState<string>()
  const [source, setSource] = useState<string>()
  const [credential, setCredential] = useState<ICredential>()
  const [triggers, setTriggers] = useState<ITrigger[]>([])
  const [output, setOutput] = useState<string>()
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadFunction() {
      setIsLoading(true)
      const fn = await BoxFunction.load(functionId as string)
      setFn(fn)
      setName(fn.name)
      setSource(await fn.getSource())

      const settings = await fn.getSettings()
      setCredential(settings.credential)
      setTriggers(settings.triggers)
      setIsLoading(false)
    }
    if (functionId) loadFunction()
  }, [functionId])

  async function updateSource(text: string) {
    await fn.updateSource(text)
    // setSource(text)
  }

  async function updateCredential(credential: ICredential) {
    await fn.updateSettings({
      credential,
      triggers
    })
    setCredential(credential)
  }

  async function createTrigger(config: ITriggerConfig) {
    const trigger = await fn.createTrigger(config)
    const updatedTriggers = [...triggers, trigger]
    await fn.updateSettings({
      credential,
      triggers: updatedTriggers
    })
    setTriggers(updatedTriggers)
  }

  async function deleteTrigger(triggerId: string) {
    await fn.deleteTrigger(triggerId)
    const updatedTriggers = triggers.filter(t => t.id !== triggerId)
    await fn.updateSettings({
      credential,
      triggers: updatedTriggers
    })
    setTriggers(updatedTriggers)
  }

  async function run() {
    setIsRunning(true)
    try {
      const res = await fn.run()
      setOutput(res)
    }
    catch (e) {
      setOutput(e.message)
    }
    setIsRunning(false)
  }

  return { name, isLoading, source, updateSource, credential, updateCredential, triggers, createTrigger, deleteTrigger, run, isRunning, output }
}


function FunctionBar({ name, isRunning, onRun }) {

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'grey.300', p: 1 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
      >
        <Link underline="hover" color="inherit" href="/">Home</Link>
        <Typography>{name}</Typography>
      </Breadcrumbs>
      <div>
        <Button variant="contained" color="primary" startIcon={<ShareIcon />} disabled> Share </Button>
        <Button sx={{ ml: 2 }} variant="contained" color="primary" startIcon={<PlayCircleIcon />} onClick={onRun} disabled={isRunning}> Run </Button>
      </div>
    </Box>
  )
}


function FunctionOutput({ output, isRunning }) {
  return (
    <Box sx={{ textAlign: 'left', borderTop: 1, borderColor: 'grey.300', p: 1 }}>
      <div><strong>Output</strong></div>
      <Box sx={{ whiteSpace: "pre-line", borderColor: 'text.disabled', marginTop: 2, color: 'text.secondary' }}>
        {isRunning ? <LinearProgress /> : null}
        {typeof output === 'string' && !isRunning ?
          <CodeMirror
            value={output}
            basicSetup={false}
            editable={false}
            extensions={[]}
          /> : null
        }
      </Box>
    </Box>
  )
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
              <FunctionBar name={fn.name} isRunning={fn.isRunning} onRun={fn.run} />
              <VerticalTabs
                tabs={[
                  'Source',
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} key='credentials'>
                    <Typography variant='body2'> Credentials </Typography>
                    {fn.credential?.value ? null : <ErrorOutlineIcon color="error" />}
                  </Box>,
                  'Triggers'
                ]}
                panels={[
                  <FunctionSource key="code" source={fn.source} updateSource={fn.updateSource} />,
                  <FunctionCredentials key="credentials" credential={fn.credential} updateCredential={fn.updateCredential} />,
                  <FunctionTrigger key="trigger" triggers={fn.triggers} createTrigger={fn.createTrigger} deleteTrigger={fn.deleteTrigger} />]} />
              <FunctionOutput output={fn.output} isRunning={fn.isRunning} />
            </Fragment>) : null
        }
      </AuthGuard>
    </Container>
  )
}