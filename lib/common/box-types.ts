export interface IBoxItem {
  id: string
  name: string
}


export enum IBoxItemType {
  file = 'file',
  folder = 'folder'
}


export interface IBoxUserToken {
  accessToken: string
  refreshToken: string
}


export interface IBoxJsonWebToken {
  boxAppSettings: {
    clientID: string,
    clientSecret: string
    appAuth: {
      publicKeyID: string,
      privateKey: string
      passphrase: string
    }
  }
  enterpriseID: string
}


export enum IBoxCredentialType {
  Token = 'Token',
  JWT = 'JWT'
}


export interface IBoxTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}


export interface IBoxWebhookRequest {
  address: string
  target: {
    id: string
    type: string
  }
  triggers: string[]
}

