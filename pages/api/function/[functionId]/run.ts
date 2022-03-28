import BoxSDK from "box-node-sdk"
import { getBufferConsole, logOutput, unpackFunction, getBoxClientServiceAccount } from "../../../../lib/server/util"
import vm from 'vm'
import { NextApiRequest, NextApiResponse } from "next";


function error(res, status = 404, e = null) {
  res.status(status)
  if (e) res.send(e)
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { functionId } = req.query

  try {
    const boxClient = getBoxClientServiceAccount()
    const fn = await unpackFunction(boxClient, functionId as string)
    const boxSdk = BoxSDK.getPreconfiguredInstance(fn.credential.value)
    const box = boxSdk.getAppAuthClient('enterprise')
    const [ console, chunks ] = getBufferConsole()
    const context = {
      box,
      payload: req.body,
      console
    }
    const func = vm.runInNewContext(`async function _execute() { 'use strict'; ${fn.source} }; _execute;`, context, { timeout: 1000 })
    await func(context)
    const log = Buffer.concat(chunks as Buffer[])
    res.write(log)
    res.status(200).end()
    logOutput(boxClient, functionId as string, log)
  }
  catch (e) {
    console.error(e)
    error(res, 400, `${e.name}: ${e.message}`)
  }
}