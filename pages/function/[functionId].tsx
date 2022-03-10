import { Container } from "@mui/material";
import { Fragment, useContext, useEffect, useReducer, useState } from "react";
import { useRouter } from "next/router";
import { debounce } from "lodash";

import AuthGuard from "../../components/auth-guard";
import FunctionCredentials from "../../components/function-credentials";
import FunctionSource from "../../components/function-source";
import Header from "../../components/header";
import VerticalTabs from "../../components/vertical-tabs";
import FunctionBar from "../../components/function-bar";
import FunctionOutput from "../../components/function-output";
import FunctionTrigger from "../../components/function-trigger";
import { BoxFunction } from "../../lib/box-function";


export default function Function() {
  const router = useRouter()
  const { functionId } = router.query

  const [fn, setFn] = useState<BoxFunction>(null)

  const [output, setOutput] = useState<string>()
  const [running, setRunning] = useState(false)

  const [sourceText, setSourceText] = useState<string>()

  useEffect(() => {
    async function loadFunction() {
      const boxFn = await BoxFunction.load(functionId as string)
      setFn(boxFn)
      setSourceText(await boxFn.getSource())
    }
    if (functionId) loadFunction()
  }, [functionId])

  const onRun = debounce(async () => {
    setRunning(true)
    const res = await fn.run()
    setRunning(false)
    setOutput(res)
  })

  const onUpdateSource = async () => {

  }

  return (
    <Container>
      <AuthGuard>
        <Header />
        {
          fn ? (
            <Fragment>
              <FunctionBar fn={fn} running={running} onRun={onRun} />
              <VerticalTabs
                tabs={['Source', 'Credentials', 'Triggers']}
                panels={[
                  <FunctionSource fn={fn} text={sourceText} setText={setSourceText} key="code" />,
                  <FunctionCredentials fn={fn} key="credentials" />,
                  <FunctionTrigger key="trigger" />]} />
              <FunctionOutput output={output} running={running} />
            </Fragment>) : null
        }
      </AuthGuard>
    </Container>
  )
}