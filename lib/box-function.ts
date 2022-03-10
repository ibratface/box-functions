import axios from "axios";
import { BoxClient } from "./box-api";
import { BoxJsonWebToken, BoxUserToken } from "./box-api"
import UserContext from "./user-context";

export interface IBoxItem {
  id: string
  name: string
}


export enum CredentialType {
  Token = 'Token',
  JWT = 'JWT'
}


export interface FunctionTrigger {
  id: string
}


export interface FunctionInfo {
  id: string
  name: string
  source: FunctionFile
  credentialType: CredentialType
  credential: BoxUserToken | BoxJsonWebToken
  triggers: FunctionTrigger[]
}


const credentials_template = `{
  "boxAppSettings": {
    "clientID": "abcdefghijklmnopqrstuvwxyz",
    "clientSecret": "********************************",
    "appAuth": {
      "publicKeyID": "",
      "privateKey": "",
      "passphrase": ""
    }
  },
  "enterpriseID": "123456789"
}`

const SOURCE_FILENAME = 'source.js'
const SOURCE_TEMPLATE = `//
// Context Variables:
//   box - Box Node SDK BoxClient instance configured using your app settings
//   console - standard debugging console
//
const me = await box.users.get(box.CURRENT_USER_ID)
console.log("Hello World, my user is:")
console.log(me)`

const SETTINGS_FILENAME = '.boxfn'
const SETTINGS_TEMPLATE = ''

export class BoxFunction {

  static async create(name) {
    const context = UserContext.Current
    const boxClient = new BoxClient(context)

    const fn = await boxClient.createFolder(name, context.rootFolderID)
    await boxClient.uploadFile(fn.id, SOURCE_FILENAME, SOURCE_TEMPLATE)
    await boxClient.uploadFile(fn.id, SETTINGS_FILENAME, SETTINGS_TEMPLATE)

    return fn
  }

  static async load(id: string): Promise<BoxFunction> {
    const context = UserContext.Current
    const boxClient = new BoxClient(context)

    const folder = await boxClient.getFolderInfo(id)
    const { entries: folderItems } = await boxClient.listFolderItems(id)
    const [sourceFile] = folderItems.filter(i => i.name == SOURCE_FILENAME)
    const [settingsFile] = folderItems.filter(i => i.name == SETTINGS_FILENAME)

    return new BoxFunction(folder, sourceFile, settingsFile)
  }

  private readonly folder: IBoxItem
  private readonly sourceFile: IBoxItem
  private readonly settingsFile: IBoxItem

  private constructor(folder, sourceFile, settingsFile) {
    this.folder = folder
    this.sourceFile = sourceFile
    this.settingsFile = settingsFile
  }

  get id(): string {
    return this.folder.id
  }

  get name(): string {
    return this.folder.name
  }

  getSource() {
    const boxClient = new BoxClient(UserContext.Current)
    return boxClient.downloadFile(this.sourceFile.id)
  }

  updateSource(text: string) {
    const boxClient = new BoxClient(UserContext.Current)
    return boxClient.uploadFileVersion(this.sourceFile.id, text)
  }

  run(): Promise<string> {
    return axios({
      method: 'get',
      url: `/api/function/${this.id}/run`,
    }).then(res => res.data)
  }

  addTrigger(trigger: FunctionTrigger) {

  }

  removeTrigger(trigger: FunctionTrigger) {

  }

}