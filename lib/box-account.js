import BoxSDK from 'box-node-sdk'
import boxConfig from '../conf/box.config'


export class BoxAccount {

  _client = null

  constructor(client) {
    this._client = client
  }

  getClient() {
    return this._client
  }

  async getCurrentUser() {
    return await this._client.users.get(this._client.CURRENT_USER_ID)
  }

  async findItemByName(parentId, name) {
    const items = await this._client.folders.getItems(parentId, { fields: ['id', 'name'] })
    userFolder = items.entries.forEach(i => {
      if (i.name == user.id) return i
    })
    return null
  }

  async getOrCreateFolder(parentId, name) {
    try {
      return await this._client.folders.create(parentId, name)
    }
    catch (e) {
      if (e.statusCode == 409 && e.response.body.code === 'item_name_in_use') {
        return e.response.body.context_info.conflicts[0]
      }
      else {
        console.error(e)
        throw e
      }
    }
  }

  async collaborateUserFolder(userId, folderId) {
    try {
      return await this._client.collaborations.createWithUserID(userId, folderId, this._client.collaborationRoles.VIEWER_UPLOADER)
    }
    catch (e) {
      console.error(e)
    }
  }
}


export function getBoxUserAccount(token) {
  const box = new BoxSDK({
    clientID: boxConfig.frontend.boxAppSettings.clientID,
    clientSecret: boxConfig.frontend.boxAppSettings.clientSecret
  })
  const userAccount = box.getBasicClient(token)
  return new BoxAccount(userAccount)
}


export function getBoxAppServiceAccount() {
  if (typeof getBoxAppServiceAccount.singleton == 'undefined') {
    const box = BoxSDK.getPreconfiguredInstance(boxConfig.backend)
    const userAccount = box.getAppAuthClient('enterprise')
    getBoxAppServiceAccount.singleton = new BoxAccount(userAccount)
  }
  return getBoxAppServiceAccount.singleton
}
