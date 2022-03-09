import BoxSDK from 'box-node-sdk'
import boxConfig from '../conf/box.config'


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
