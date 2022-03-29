import axios from "axios";
import { BoxClient } from "./box-api";
import { IBoxItemType, IBoxItem, IBoxJsonWebToken, IBoxUserToken, IBoxCredentialType, IBoxWebhook } from "../common/box-types";
import { FUNCTION_FILENAME, FUNCTION_LOGDIRNAME, FUNCTION_TEMPLATE } from "../../conf/app.config"
import UserContext from "./user-context";
import { UserSession } from "./user-session";
import useSWR, { useSWRConfig } from "swr";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";


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
  payload: string
  credential: ICredential
  triggers: IBoxWebhook[]
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
  const { mutate } = useSWRConfig()

  async function createFunction(name) {
    const context = UserContext.Current
    const boxClient = new BoxClient(context)

    const fn = await boxClient.createFolder(name, context.rootFolderID)
    await boxClient.createFolder(FUNCTION_LOGDIRNAME, fn.id)
    await boxClient.uploadFile(fn.id, FUNCTION_FILENAME, JSON.stringify({ ...FUNCTION_TEMPLATE, name }))
    mutate('/function')

    return fn
  }

  return {
    functions: data,
    error,
    createFunction,
  }
}


export function getTriggerAddress(functionId) {
  return `${process.env.origin}/api/function/${functionId}/run`
}


export function useFunction(functionId) {

  const uri = `/function/${functionId}`

  async function loadItems() {
    const boxClient = UserSession.Current.BoxClient

    const { entries: folderItems } = await boxClient.listFolderItems(functionId)
    const [file] = folderItems.filter(i => i.name == FUNCTION_FILENAME)
    const [logFolder] = folderItems.filter(i => i.name == FUNCTION_LOGDIRNAME)

    return { file, logFolder }
  }

  const { data: items } = useSWR(`${uri}/items`, loadItems)

  const [fn, setFn] = useState<IBoxFunction>()
  useEffect(() => {
    async function loadFunction() {
      const boxClient = UserSession.Current.BoxClient
      const fileContents = await boxClient.downloadFile(items.file.id)
      const jsonObject = JSON.parse(fileContents)
      return setFn(jsonObject)
    }
    if (items) loadFunction()
  }, [items])

  async function updateFunction(fn: IBoxFunction) {
    setFn(fn)
    UserSession.Current.BoxClient.uploadFileVersion(items.file.id, JSON.stringify(fn))
  }

  async function updateSource(text: string) {
    await updateFunction({
      ...fn,
      source: text
    })
  }

  async function updatePayload(text: string) {
    await updateFunction({
      ...fn,
      payload: text
    })
  }

  async function updateCredential(credential: ICredential) {
    await updateFunction({
      ...fn,
      credential: credential
    })
  }

  async function run(): Promise<string> {
    return axios({
      method: 'post',
      url: `/api/function/${functionId}/run`,
      data: JSON.parse(fn.payload)
    }).then(res => res.data).catch(e => {
      if (e.response) {
        throw e.response.data
      }
      else {
        throw e
      }
    })
  }

  async function createTrigger(config: ITriggerConfig): Promise<ITrigger> {
    const address = getTriggerAddress(functionId)
    const res = await UserSession.Current.BoxClient.createWebhook({
      address,
      target: {
        id: config.target.id,
        type: config.target.type as string
      },
      triggers: config.events
    })
    await updateFunction({
      ...fn,
      triggers: [...fn.triggers, res]
    })
    return res
  }

  async function deleteTrigger(triggerId: string): Promise<void> {
    const res = await UserSession.Current.BoxClient.deleteWebhook(triggerId)
    await updateFunction({
      ...fn,
      triggers: fn.triggers.filter(t => t.id !== triggerId)
    })
    return res
  }

  async function deleteFunction() {
    const boxClient = UserSession.Current.BoxClient
    await fn?.triggers?.forEach(async t => {
      await boxClient.deleteWebhook(t.id)
    })
    await boxClient.deleteFolder(functionId)
  }

  return { ...fn, updateSource, updatePayload, updateCredential, run, createTrigger, deleteTrigger, logFolder: items?.logFolder, deleteFunction }
}
