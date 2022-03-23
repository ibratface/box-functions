import BoxSDK from "box-node-sdk"
import { getHttpResponseConsole, unpackFunction } from "../../../../lib/server/util"
import vm from 'vm'
import { NextApiRequest, NextApiResponse } from "next";


function error(res, status = 404, e = null) {
  res.status(status)
  if (e) res.send(e)
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { functionId } = req.query

  try {
    const fn = await unpackFunction(functionId as string)
    const boxSdk = BoxSDK.getPreconfiguredInstance(fn.credential.value)
    const box = boxSdk.getAppAuthClient('enterprise')

    const context = {
      box,
      payload: req.body,
      console: getHttpResponseConsole(res)
    }
    const func = vm.runInNewContext(`async function _execute() { 'use strict'; ${fn.source} }; _execute;`, context, { timeout: 1000 })
    await func(context)
    res.status(200).end()
  }
  catch (e) {
    console.error(e)
    error(res, 400, `${e.name}: ${e.message}`)
  }
}