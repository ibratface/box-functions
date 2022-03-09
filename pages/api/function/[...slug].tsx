import BoxSDK from "box-node-sdk"
import { getBoxClientUser } from "../../../lib/box-account"
import vm from 'vm'
import { Console } from 'console';
import stream from 'stream';
import appConfig from "../../../conf/app.config";
import { NextApiRequest, NextApiResponse } from "next";


function error(res, status = 404, e = null) {
  res.status(status)
  if (e) res.send(e)
}


function streamToString(stream): Promise<string> {
  const chunks = [];
  return new Promise<string>((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  })
}


async function downloadFile(boxClient, items, filename): Promise<string> {
  for (const i of items) {
    if (i.name === filename) {
      const stream = await boxClient.files.getReadStream(i.id)
      return streamToString(stream)
    }
  }
  throw {
    message: "File not found"
  };
}


function getConsole(res) {
  const httpStream = new stream.Writable();
  httpStream._write = function (chunk, encoding, done) {
    res.write(chunk, encoding);
    done();
  };

  return new Console(httpStream, httpStream, false)
}

const BEARER_PREFIX = 'Bearer '

function stripBearer(authorization) {
  return authorization.startsWith(BEARER_PREFIX) ? authorization.substring(BEARER_PREFIX.length) : null
}

function getAccessToken(req: NextApiRequest) {
  return req.cookies['box_access_token']
}


async function runFunction(id, action, req, res) {
  const boxClient = getBoxClientUser(getAccessToken(req))

  try {
    const result = await boxClient.folders.getItems(id, { fields: 'id,name' })
    const credentialsFile = await downloadFile(boxClient, result.entries, appConfig.files.credentials.filename)
    const sourceFile = await downloadFile(boxClient, result.entries, appConfig.files.source.filename)

    const settings = JSON.parse(credentialsFile)
    const boxSdk = BoxSDK.getPreconfiguredInstance(settings)
    const box = boxSdk.getAppAuthClient('enterprise')

    const context = {
      box,
      console: getConsole(res)
    }
    const func = vm.runInNewContext(`async function _execute() { 'use strict'; ${sourceFile} }; _execute;`, context, { timeout: 1000 })
    await func(context)
    res.status(200).end()
  }
  catch (e) {
    console.log(e)
    error(res, 400, `${e.name}: ${e.message}`)
  }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  if (slug.length > 2) error(res)

  const [functionId, action] = slug as string[]
  switch (action) {
    case 'run':
      await runFunction(functionId, action, req, res)
      break
    default:
      error(res)
  }
}