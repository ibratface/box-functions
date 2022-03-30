import BoxSDK from 'box-node-sdk'
import boxConfig from '../../conf/box.config'
import stream from 'stream';
import { Console } from 'console';
import { NextApiRequest } from 'next';
import { FUNCTION_FILENAME, FUNCTION_LOGBUFSIZE, FUNCTION_LOGDIRNAME } from '../../conf/app.config';
import BoxClient from 'box-node-sdk/lib/box-client';


export function getBoxClientUser(token) {
  const box = new BoxSDK({
    clientID: boxConfig.frontend.boxAppSettings.clientID,
    clientSecret: boxConfig.frontend.boxAppSettings.clientSecret
  })
  return box.getBasicClient(token)
}


export function getBoxClientServiceAccount(): BoxClient {
  const sdk = BoxSDK.getPreconfiguredInstance(boxConfig.backend)
  const client = sdk.getAppAuthClient('enterprise')
  return client
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
    message: `File not found: ${filename}`
  };
}


export async function unpackFunction(boxClient: BoxClient, functionId: string) {
  const result = await boxClient.folders.getItems(functionId, { fields: 'id,name' })
  const file = await downloadFile(boxClient, result.entries, FUNCTION_FILENAME)
  return JSON.parse(file)
}


export function timestamp() {
  return new Date().getTime()
}


export async function logOutput(boxClient: BoxClient, functionId: string, logBuffer: Buffer) {
  let logFolderId = null
  try {
    const logFolder = await boxClient.folders.create(functionId, FUNCTION_LOGDIRNAME)
    logFolderId = logFolder.id
  }
  catch (e) {
    const body = e.response.body
    if (body.status == 409 && body.code === 'item_name_in_use') {
      logFolderId = body.context_info.conflicts[0].id
    }
    else {
      console.error(e)
    }
  } finally {
    if (logFolderId) {
      boxClient.files.uploadFile(logFolderId, `${timestamp().toString()}.log`, logBuffer)
    }
  }
}


const BEARER_PREFIX = 'Bearer '


export function stripBearer(authorization) {
  return authorization.startsWith(BEARER_PREFIX) ? authorization.substring(BEARER_PREFIX.length) : null
}


export function getAccessToken(req: NextApiRequest) {
  return req.cookies['box_access_token']
}


export function getHttpResponseConsole(res) {
  const httpStream = new stream.Writable();
  httpStream._write = function (chunk, encoding, done) {
    res.write(chunk, encoding);
    done();
  };

  return new Console(httpStream, httpStream, false)
}

export function getBufferConsole() {
  const chunks = []
  const bufStream = new stream.Writable();
  bufStream._write = function (chunk, encoding, done) {
    chunks.push(Buffer.from(chunk))
    done();
  };

  return [new Console(bufStream, bufStream, false), chunks]
}
