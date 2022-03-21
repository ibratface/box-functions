import axios from "axios";
import { BoxClient } from "./box-api";
import UserContext from "./user-context";


export class UserSession {

  private static instance: UserSession

  static get Current() {
    if (!UserSession.instance) UserSession.instance = new UserSession()
    return UserSession.instance
  }

  private _boxClient: BoxClient
  private _context: UserContext

  private constructor() {
    this._context = UserContext.Current
    this._boxClient = new BoxClient(this._context)
  }

  getAuthorization() {
    return this._boxClient.getAuthorizationCode()
  }

  completeAuthorization(code: string) {
    return this._boxClient.getTokenWithAuthorizationCode(code)
  }

  async reauthorize() {
    if (!this._boxClient.token.accessToken && this._boxClient.token.refreshToken) await this._boxClient.refreshToken()
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
      if (e.status == 409 && e.code === 'item_name_in_use') {
        rootFolderId = e.context_info.conflicts[0].id
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
      if (e.status == 400 && e.code === 'user_already_collaborator') {
        // do nothing
      }
      else {
        throw e
      }
    }

    // register folder
    await axios({
      method: 'post',
      url: '/api/register',
      data: {
        folderId: rootFolderId
      }
    })
  }
}


