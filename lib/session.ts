import axios from "axios";
import { BoxClient } from "./box-api";
import AppContext from "./user-context";

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

const source_template = `//
// Context Variables:
//   box - Box Node SDK BoxClient instance configured using your app settings
//   console - standard debugging console
//
const me = await box.users.get(box.CURRENT_USER_ID)
console.log("Hello World, my user is:")
console.log(me)`


export class Session {

  private static instance: Session

  static get Current() {
    if (!Session.instance) Session.instance = new Session()
    return Session.instance
  }

  private _boxClient: BoxClient
  private _context: AppContext

  private constructor() {
    this._context = AppContext.Current
    this._boxClient = new BoxClient(this._context)
  }

  getAuthorization() {
    return this._boxClient.getAuthorizationCode()
  }

  completeAuthorization(code: string) {
    return this._boxClient.getTokenWithAuthorizationCode(code)
  }

  async reauthorize() {
    if (this._boxClient.token.refreshToken) this._boxClient.refreshToken()
  }

  get IsValid() {
    return this._boxClient.token.IsValid
  }

  get BoxClient() {
    return this._boxClient
  }

  async initialize() {
    // get or create user folder
    let rootFolderId = null
    try {
      const folder = await this._boxClient.createFolder('Box Functions', 0)
      rootFolderId = folder.id
    }
    catch (e) {
      if (e.response && e.response.data.status == 409 && e.response.data.code === 'item_name_in_use') {
        rootFolderId = e.response.data.context_info.conflicts[0].id
      }
      else {
        throw e
      }
    }
    this._context.rootFolderID = rootFolderId

    // collaborate
    try {
      await this._boxClient.shareFolderWithUserLogin(rootFolderId, this._context.serviceAccountID)
    }
    catch (e) {
      if (e.response && e.response.data.status == 400 && e.response.data.code === 'user_already_collaborator') {
        // do nothing
      }
      else {
        throw e
      }
    }
  }

  async listFunctions() {
    const { entries: f } = await this._boxClient.listFolderItems(this._context.rootFolderID)
    return f
  }

  async createFunction(name) {
    const fn = await this._boxClient.createFolder(name, this._context.rootFolderID)
    await this._boxClient.uploadFile(fn.id, 'source.js', source_template)
    await this._boxClient.uploadFile(fn.id, 'credentials.json', credentials_template)
    return fn
  }

  getFunctionInfo(functionId) {
    return this._boxClient.getFolderInfo(functionId)
  }

  async listFunctionFiles(functionId) {
    const { entries: f } = await this._boxClient.listFolderItems(functionId)
    return f
  }

  uploadFile(functionId, filename, content) {
    return this._boxClient.uploadFile(functionId, filename, content)
  }

  updateFile(fileId, content) {
    return this._boxClient.uploadFileVersion(fileId, content)
  }

  downloadFile(fileId) {
    return this._boxClient.downloadFile(fileId)
  }

  deleteFunction(functionId) {
    return this._boxClient.deleteFolder(functionId)
  }

  runFunction(functionId) {
    return axios({
      method: 'get',
      url: `/api/function/${functionId}/run`,
    }).then(res => res.data)
  }
}
