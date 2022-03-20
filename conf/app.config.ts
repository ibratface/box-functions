import { IBoxFunctionSettings } from "../lib/client/box-function"
import { IBoxCredentialType, IBoxJsonWebToken } from "../lib/common/box-types"


const JWT_TEMPLATE: IBoxJsonWebToken = {
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

const SOURCE_FILENAME: string = 'source.js'
const SOURCE_TEMPLATE: string = `/**
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

const SETTINGS_FILENAME: string = '.boxfn'
const SETTINGS_TEMPLATE: IBoxFunctionSettings = {
  credential: {
    type: IBoxCredentialType.JWT,
    value: null
  },
  triggers: []
}


export default {
  settings: {
    filename: SETTINGS_FILENAME,
    template: SETTINGS_TEMPLATE
  },
  source: {
    filename: SOURCE_FILENAME,
    template: SOURCE_TEMPLATE
  },
  credential: {
    template: JWT_TEMPLATE
  }
}