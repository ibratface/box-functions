import axios from "axios";
import { BoxClient } from "./box-api";
import { IBoxItemType, IBoxItem, IBoxJsonWebToken, IBoxUserToken, IBoxCredentialType } from "../common/box-types";
import { FUNCTION_FILENAME, FUNCTION_TEMPLATE } from "../../conf/app.config"
import UserContext from "./user-context";
import { UserSession } from "./user-session";
import useSWR, { mutate } from "swr";


export interface ICredential {
  type: IBoxCredentialType
  value: IBoxUserToken | IBoxJsonWebToken
}


export interface ITriggerConfig {
  target: {
    id: string
    type: IBoxItemType
  },
  events: string[]
}


export interface ITrigger extends ITriggerConfig {
  id: string
  address: string
}


export interface IBoxFunctionSettings {
  payload: object
  credential: ICredential
  triggers: ITrigger[]
}

export interface IBoxFunction {
  name: string
  description: string
  source: string
  payload: object
  credential: ICredential
}

export interface IBoxFunctionFile {
  file: IBoxItem,
  contents: IBoxFunction
}


export function useFunctionList(rootFolderId) {

  async function listFunctions() {
    const { entries: f } = await UserSession.Current.BoxClient.listFolderItems(rootFolderId)
    return f
  }

  const { data, error } = useSWR('/function', listFunctions)

  async function createFunction(name) {
    const context = UserContext.Current
    const boxClient = new BoxClient(context)

    const fn = await boxClient.createFolder(name, context.rootFolderID)
    await boxClient.uploadFile(fn.id, FUNCTION_FILENAME, JSON.stringify({ ...FUNCTION_TEMPLATE, name }))
    mutate('/function')

    return fn
  }

  async function deleteFunction(functionId: string) {
    await UserSession.Current.BoxClient.deleteFolder(functionId)
    await mutate('/function')
  }

  return {
    functions: data,
    error,
    createFunction,
    deleteFunction
  }
}

export function useFunction(functionId) {
  const uri = `/function/${functionId}`

  async function loadFunction() {
    const boxClient = UserSession.Current.BoxClient

    const { entries: folderItems } = await boxClient.listFolderItems(functionId)
    const [file] = folderItems.filter(i => i.name == FUNCTION_FILENAME)
    const fileContents = await boxClient.downloadFile(file.id)
    const contents = JSON.parse(fileContents)

    async function updateFunction(contents: IBoxFunction) {
      const boxClient = UserSession.Current.BoxClient
      const res = await boxClient.uploadFileVersion(file.id, JSON.stringify(contents))
      mutate(uri)
    }
  
    async function updateSource(text: string) {
      await updateFunction({
        ...contents,
        source: text
      })
    }
  
    async function updatePayload(payload: object) {
      await updateFunction({
        ...contents,
        payload: payload
      })
    }
  
    async function updateCredential(credential: ICredential) {
      await updateFunction({
        ...contents,
        credential: credential
      })
    }
  
    async function run(): Promise<string> {
      return axios({
        method: 'post',
        url: `/api/function/${functionId}/run`,
        data: contents.payload
      }).then(res => res.data)
    }

    return { ...contents, updateSource, updatePayload, updateCredential, run } 
  }

  const { data, error } = useSWR(uri, loadFunction)
  return { ...data, error }
}
