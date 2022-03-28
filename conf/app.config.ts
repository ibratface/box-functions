import { IBoxFunction, IBoxFunctionSettings } from "../lib/client/box-function"
import { IBoxCredentialType, IBoxJsonWebToken } from "../lib/common/box-types"


export const JWT_TEMPLATE: IBoxJsonWebToken = {
  "boxAppSettings": {
    "clientID": "",
    "clientSecret": "",
    "appAuth": {
      "publicKeyID": "",
      "privateKey": "",
      "passphrase": ""
    }
  },
  "enterpriseID": ""
}

export const SOURCE_FILENAME: string = 'source.js'
export const SOURCE_TEMPLATE: string = `/**
 * Context Variables:
 *
 * @param {object} box       Box Node SDK BoxClient instance configured using your function credentials (https://rawgit.com/box/box-node-sdk/main/docs/jsdoc/BoxClient.html) 
 * @param {object} console - Node.js Console instance (https://nodejs.org/api/console.html)
 * @param {object} payload - HTTP Request body
 */
const me = await box.users.get(box.CURRENT_USER_ID)
console.log("Hello World, my user is:")
console.log(me)

if (payload?.source?.id && payload?.source?.type === 'file')
{
  await box.comments.create(payload.source.id, "Don't look at me!")
}`

export const SETTINGS_FILENAME: string = '.boxfn'
export const SETTINGS_TEMPLATE: IBoxFunctionSettings = {
  payload: {},
  credential: {
    type: IBoxCredentialType.JWT,
    value: null
  },
  triggers: []
}


export const FUNCTION_FILENAME: string = 'boxfn.json'
export const FUNCTION_TEMPLATE: IBoxFunction = {
  name: '',
  description: '',
  source: SOURCE_TEMPLATE,
  payload: '',
  credential: {
    type: IBoxCredentialType.JWT,
    value: null
  },
  triggers: []
}


export const FUNCTION_LOGDIRNAME: string = 'logs'
export const FUNCTION_LOGBUFSIZE: number = 1024 * 10