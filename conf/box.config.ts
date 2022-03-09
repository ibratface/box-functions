
export default {
  "frontend": {
    "boxAppSettings": {
      "clientID": process.env.BOX_FRONTEND_CLIENT_ID,
      "clientSecret": process.env.BOX_FRONTEND_CLIENT_SECRET,
    },
  },
  "backend": {
    "boxAppSettings": {
      "clientID": process.env.BOX_BACKEND_CLIENT_ID,
      "clientSecret": process.env.BOX_BACKEND_CLIENT_SECRET,
      "appAuth": {
        "publicKeyID": process.env.BOX_BACKEND_PUBLIC_KEY_ID,
        "privateKey": process.env.BOX_BACKEND_PRIVATE_KEY,
        "passphrase": process.env.BOX_BACKEND_PASSPHRASE
      }
    },
    "enterpriseID": process.env.BOX_BACKEND_ENTERPRISE_ID,
    "rootFolderID": process.env.BOX_BACKEND_ROOT_FOLDER_ID,
    "serviceAccountID": process.env.BOX_BACKEND_SERVICE_ACCOUNT_ID
  }
}