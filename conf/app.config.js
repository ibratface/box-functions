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


export default {
  "files": {
    "credentials": {
      "filename": "credentials.json",
      "template": credentials_template
    },
    "source": {
      "filename": "source.js",
      "template": source_template
    }
  }
}