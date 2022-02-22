import axios from "axios";
import dayjs from "dayjs";


const formData = (data) => {
  const form = new FormData()
  form.append('attributes', JSON.stringify(data.attributes))
  form.append('file', new Blob([data.file], { type: 'text/plain' }))
  return form
}


export class UserAccount {

  authorizeUrl = "https://account.box.com/api/oauth2/authorize"
  authenticationUrl = 'https://api.box.com/oauth2/token'
  foldersUrl = 'https://api.box.com/2.0/folders'
  filesUrl = 'https://api.box.com/2.0/files'

  collaborationsUrl = 'https://api.box.com/2.0/collaborations'

  uploadPreflightUrl = 'https://api.box.com/2.0/files/content'
  uploadUrl = 'https://upload.box.com/api/2.0/files'

  context = null;

  constructor(context) {
    this.context = context;
  }

  encodeUrl(url, query) {
    return url + (query ? "?" + new URLSearchParams(query) : '');
  }

  getAuthorizeUrl() {
    return this.encodeUrl(this.authorizeUrl, {
      client_id: this.context.clientID,
      redirect_uri: window.location.origin + '/oauth/callback',
      response_type: 'code',
    })
  }

  _setContextTokens(res) {
    this.context.setAccessToken(res.data.access_token)
    this.context.setAccessTokenExpiry(dayjs().add(res.data.expires_in, 'second').unix())
    this.context.setRefreshToken(res.data.refresh_token)
  }

  _revokeContextTokens() {
    this.context.setAccessToken(null)
    this.context.setAccessTokenExpiry(null)
    this.context.setRefreshToken(null)
  }

  async _initializeUser(accessToken) {

    // get or create user folder
    let userFolderId = null
    try {
      const res = await axios.post(this.foldersUrl, {
        name: 'Box Functions',
        parent: {
          id: 0
        }
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { fields: 'id' }
      })
      userFolderId = res.data.id
    }
    catch (e) {
      if (e.response && e.response.data.status == 409 && e.response.data.code === 'item_name_in_use') {
        userFolderId = e.response.data.context_info.conflicts[0].id
      }
      else {
        throw e
      }
    }
    this.context.setUserFolderId(userFolderId)

    // collaborate
    try {
      const res = await axios.post(this.collaborationsUrl, {
        accessible_by: {
          login: this.context.serviceAccountID,
          type: 'user'
        },
        can_view_path: false,
        item: {
          id: userFolderId,
          type: 'folder'
        },
        role: 'viewer'
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { fields: 'id' }
      })
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

  async getAuthorization(code) {
    try {
      let res = await axios.post(this.authenticationUrl, {
        grant_type: 'authorization_code',
        code: code,
        client_id: this.context.clientID,
        client_secret: this.context.clientSecret,
      })
      this._setContextTokens(res)
      await this._initializeUser(res.data.access_token)
    }
    catch (e) {
      console.error(e)
      this._revokeContextTokens()
      throw e
    }
  }

  isAuthorized() {
    return this.context.accessToken && this.context.accessTokenExpiry > dayjs().unix() && this.context.userFolderId
  }

  async _doRefreshTokens() {
    try {
      const res = await axios.post(this.authenticationUrl, {
        grant_type: 'refresh_token',
        client_id: this.context.clientID,
        client_secret: this.context.clientSecret,
        refresh_token: this.context.refreshToken,
      })
      this._setContextTokens(res)
    }
    catch (e) {
      console.error(e)
      this._revokeContextTokens()
    }
  }

  async refreshTokens() {
    if (this.context.refreshToken && this.context.accessTokenExpiry < dayjs().unix()) {
      await this._doRefreshTokens()
    }
  }

  requestGET() {
    const req = async (url, params) => {
      await this.refreshTokens()
      return await axios.get(url, {
        headers: { Authorization: `Bearer ${this.context.accessToken}` },
        params
      })
    }
    return req
  }

  requestPOST() {
    const req = async (url, params, body) => {
      await this.refreshTokens()
      return await axios.post(url, body, {
        headers: { Authorization: `Bearer ${this.context.accessToken}` },
        params
      })
    }
    return req
  }

  requestOPTS() {
    const req = async (url, params, body) => {
      await this.refreshTokens()
      return await axios.options(url, {
        headers: { Authorization: `Bearer ${this.context.accessToken}` },
        params,
        data: body
      })
    }
    return req
  }

  request(config) {
    return async () => {
      await this.refreshTokens()
      return axios(config);
    }
  }

  async listFunctions() {
    const req = this.requestGET()
    const res = await req(this.foldersUrl + `/${this.context.userFolderId}/items`, { fields: 'id,name' })
    return res.data.entries
  }

  async createFunction(name) {
    const req = this.requestPOST()
    const res = await req(this.foldersUrl, { fields: 'id,name' }, {
      name,
      parent: {
        id: this.context.userFolderId
      }
    })
    return res.data
  }

  async getFunctionInfo(functionId) {
    const req = this.requestGET()
    const res = await req(this.foldersUrl + `/${functionId}`, { fields: 'id,name' })
    return res.data;
  }

  async listFunctionFiles(functionId) {
    const req = async () => {
      this.refreshTokens()
      return await axios({
        method: 'get',
        url: this.foldersUrl + `/${functionId}/items`,
        headers: {
          authorization: `Bearer ${this.context.accessToken}`,
          'content-type': 'multipart/form-data'
        },
        params: { fields: 'id,name' }
      }).then(res => res.data.entries)
    }
    const res = await req()
    return res
  }

  async uploadFile(functionId, filename, content) {
    const req = this.request({
      method: 'post',
      url: this.uploadUrl + '/content',
      headers: {
        authorization: `Bearer ${this.context.accessToken}`,
        'content-type': 'multipart/form-data'
      },
      params: { fields: 'id' },
      data: formData({
        attributes: {
          name: filename,
          parent: {
            id: functionId
          }
        },
        file: content
      }),
    })
    const res = await req()
    return res.data.entries[0]
  }

  async uploadFileVersion(fileId, content) {
    const req = this.request({
      method: 'post',
      url: this.uploadUrl + `/${fileId}/content`,
      headers: {
        authorization: `Bearer ${this.context.accessToken}`,
        'content-type': 'multipart/form-data'
      },
      params: { fields: 'id' },
      data: formData({
        attributes: {},
        file: content
      }),
    })
    const res = await req()
    return res.data.entries[0]
  }

  async downloadFile(fileId) {
    const req = async () => {
      this.refreshTokens()
      return await axios({
        method: 'get',
        url: this.filesUrl + `/${fileId}/content`,
        headers: {
          authorization: `Bearer ${this.context.accessToken}`,
        },
        transformResponse: res => res, // make sure it's raw
      }).then(res => res.data)
    }
    const res = await req()
    return res
  }

  async runFunction(functionId) {
    const req = async () => {
      this.refreshTokens()
      return await axios({
        method: 'get',
        url: `/api/function/${functionId}/run`,
        headers: {
          authorization: `Bearer ${this.context.accessToken}`,
        },
      }).then(res => res.data)
    }
    const res = await req()
    return res
  }

  async deleteFunction(functionId) {
    const req = async () => {
      this.refreshTokens()
      return await axios({
        method: 'delete',
        url: this.foldersUrl + `/${functionId}`,
        headers: {
          authorization: `Bearer ${this.context.accessToken}`,
        },
        params: { recursive: true }
      }).then(res => res.data)
    }
    const res = await req()
    return res
  }
}