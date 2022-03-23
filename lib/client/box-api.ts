
import axios from "axios";
import Cookies from "universal-cookie";
import { IBoxTokenResponse, IBoxUserToken, IBoxWebhookRequest } from "../common/box-types";


const BoxURLs = {
  authorization: `https://account.box.com/api/oauth2/authorize`,
  oauth: 'https://api.box.com/oauth2/token',
  folders: 'https://api.box.com/2.0/folders',
  files: 'https://api.box.com/2.0/files',
  collaborations: 'https://api.box.com/2.0/collaborations',
  uploads: 'https://upload.box.com/api/2.0/files',
  webhooks: 'https://api.box.com/2.0/webhooks',
}


const encodeUrl = (url, params) => {
  return url + (params ? "?" + new URLSearchParams(params) : '');
}


const formData = (data) => {
  const form = new FormData()
  form.append('attributes', JSON.stringify(data.attributes))
  form.append('file', new Blob([data.file], { type: 'text/plain' }))
  return form
}


export function getItemFullPath(item) {
  const path = item.path_collection?.entries?.reduce((acc, next) => `${acc}/${next.name}`, '')
  return `${path}/${item.name}`
}


export class BoxClientToken implements IBoxUserToken {

  cookies: Cookies

  constructor(res: IBoxTokenResponse = null) {
    this.cookies = new Cookies('box');
    if (res) {
      this.cookies.set('box_access_token', res.access_token, { maxAge: res.expires_in, path: '/' })
      this.cookies.set('box_refresh_token', res.refresh_token, { maxAge: 60 * 24 * 60 * 60, path: '/' })
    }
  }

  get accessToken(): string {
    return this.cookies.get('box_access_token')
  }

  get refreshToken(): string {
    return this.cookies.get('box_refresh_token')
  }

  get IsValid(): boolean {
    return (this.accessToken && this.refreshToken && true)
  }

  invalidate(): void {
    this.cookies.remove('box_refresh_token')
  }
}

interface BoxClientConfig {
  clientID: string
  clientSecret: string
}


export class BoxClient {

  private _config: BoxClientConfig
  private _token: BoxClientToken

  constructor(config: BoxClientConfig) {
    this._config = config
    this._token = new BoxClientToken()
  }

  getAuthorizationCode() {
    const url = encodeUrl(BoxURLs.authorization, {
      client_id: this._config.clientID,
      redirect_uri: window.location.origin + '/oauth/callback',
      response_type: 'code',
    })

    window.location.href = url
  }

  getTokenWithAuthorizationCode(code: string) {
    return axios.post(BoxURLs.oauth, {
      grant_type: 'authorization_code',
      code: code,
      client_id: this._config.clientID,
      client_secret: this._config.clientSecret,
    }).then(res => {
      this._token = new BoxClientToken(res.data)
      return this._token
    })
  }

  refreshToken(token: BoxClientToken = this._token) {
    return axios.post(BoxURLs.oauth, {
      grant_type: 'refresh_token',
      client_id: this._config.clientID,
      client_secret: this._config.clientSecret,
      refresh_token: token.refreshToken,
    }).then(res => {
      this._token = new BoxClientToken(res.data)
      return this._token
    })
  }

  get token(): BoxClientToken {
    return this._token
  }

  private async bearer(): Promise<string> {
    if (!this._token.IsValid) {
      await this.refreshToken(this._token)
    }
    return `Bearer ${this._token.accessToken}`
  }

  private async request(config) {
    const fetch = axios.create({
      headers: { authorization: await this.bearer() }
    })
    return await fetch.request(config).then(res => res.data).catch(e => {
      if (e.response) {
        throw e.response.data
      }
      else {
        throw e
      }
    });
  }

  createFolder(name, parentId) {
    return this.request({
      method: 'post',
      url: BoxURLs.folders,
      params: { fields: 'id,name' },
      data: {
        name,
        parent: {
          id: parentId
        }
      }
    })
  }

  deleteFolder(folderId) {
    return this.request({
      method: 'delete',
      url: BoxURLs.folders + `/${folderId}`,
      params: { recursive: true }
    })
  }

  getFolderInfo(folderId, fields = 'id,name') {
    return this.request({
      method: 'get',
      url: BoxURLs.folders + `/${folderId}`,
      params: { fields }
    })
  }

  listFolderItems(folderId) {
    return this.request({
      method: 'get',
      url: BoxURLs.folders + `/${folderId}/items`,
      headers: {
        'content-type': 'multipart/form-data'
      },
      params: { fields: 'id,name' }
    })
  }

  getFileInfo(fileId, fields = 'id,name') {
    return this.request({
      method: 'get',
      url: BoxURLs.files + `/${fileId}`,
      params: { fields }
    })
  }

  uploadFile(folderId, filename, content) {
    return this.request({
      method: 'post',
      url: BoxURLs.uploads + '/content',
      headers: {
        'content-type': 'multipart/form-data'
      },
      params: { fields: 'id' },
      data: formData({
        attributes: {
          name: filename,
          parent: {
            id: folderId
          }
        },
        file: content
      }),
    })
  }

  uploadFileVersion(fileId, content) {
    return this.request({
      method: 'post',
      url: BoxURLs.uploads + `/${fileId}/content`,
      headers: {
        'content-type': 'multipart/form-data'
      },
      params: { fields: 'id' },
      data: formData({
        attributes: {},
        file: content
      }),
    })
  }

  downloadFile(fileId) {
    return this.request({
      method: 'get',
      url: `${BoxURLs.files}/${fileId}/content`,
      transformResponse: res => res, // make sure it's raw
    })
  }

  deleteFile(fileId) {
    return this.request({
      method: 'delete',
      url: `${BoxURLs.files}/${fileId}`
    })
  }

  shareFolderWithUserLogin(folderId, userLogin) {
    return this.request({
      method: 'post',
      url: BoxURLs.collaborations,
      data: {
        accessible_by: {
          login: userLogin,
          type: 'user'
        },
        can_view_path: false,
        item: {
          id: folderId,
          type: 'folder'
        },
        role: 'viewer'
      },
      params: { fields: 'id' }
    })
  }

  listWebhooks() {
    return this.request({
      method: 'get',
      url: BoxURLs.webhooks
    })
  }

  getWebhook(webhookId) {
    return this.request({
      method: 'get',
      url: `${BoxURLs.webhooks}/${webhookId}`
    })
  }

  createWebhook(args: IBoxWebhookRequest) {
    return this.request({
      method: 'post',
      url: BoxURLs.webhooks,
      data: args
    })
  }

  deleteWebhook(webhookId) {
    return this.request({
      method: 'delete',
      url: `${BoxURLs.webhooks}/${webhookId}`
    })
  }
}