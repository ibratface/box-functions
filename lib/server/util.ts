import BoxSDK from 'box-node-sdk'
import boxConfig from '../../conf/box.config'
import stream from 'stream';
import { Console } from 'console';
import { NextApiRequest } from 'next';
import { FUNCTION_FILENAME } from '../../conf/app.config';


export function getBoxClientUser(token) {
  const box = new BoxSDK({
    clientID: boxConfig.frontend.boxAppSettings.clientID,
    clientSecret: boxConfig.frontend.boxAppSettings.clientSecret
  })
  return box.getBasicClient(token)
}


export function getBoxClientServiceAccount() {
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


export async function unpackFunction(functionId: string) {
  const boxClient = getBoxClientServiceAccount()
  const result = await boxClient.folders.getItems(functionId, { fields: 'id,name' })
  const file = await downloadFile(boxClient, result.entries, FUNCTION_FILENAME)
  return JSON.parse(file)
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

export function getStringBufferConsole(res, buffer) {
  buffer.value = ''
  const httpStream = new stream.Writable();
  httpStream._write = function (chunk, encoding, done) {
    buffer.value += chunk 
    done();
  };

  return new Console(httpStream, httpStream, false)
}
