import useSWR, { mutate } from "swr"
import { IBoxWebhook } from "../common/box-types"
import { BoxClient, getItemFullPath } from "./box-api"
import { ITrigger, ITriggerConfig } from "./box-function"
import UserContext from "./user-context"
import { UserSession } from "./user-session"


export function getTriggerAddress(functionId) {
  return `${process.env.origin}/api/function/${functionId}/run`
}


export function useTriggerList(functionId) {

  async function listTriggers() {
    const { entries: w } = await new BoxClient(UserContext.Current).listWebhooks()
    return w
  }

  const { data, error } = useSWR('/triggers', listTriggers)

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
    await mutate('/triggers')
    return res
  }

  async function deleteTrigger(triggerId: string): Promise<void> {
    const res = await UserSession.Current.BoxClient.deleteWebhook(triggerId)
    await mutate('/triggers')
    return res
  }


  return { triggers: data, error, createTrigger, deleteTrigger }
}


export function useTrigger(trigger: IBoxWebhook) {

  async function getTargetItem() {
    let target = null;
    target = trigger.target.type === 'file' ? await UserSession.Current.BoxClient.getFileInfo(trigger.target.id, 'name,path_collection') : null
    target = trigger.target.type === 'folder' ? await UserSession.Current.BoxClient.getFolderInfo(trigger.target.id, 'name,path_collection') : null
    return target ? getItemFullPath(target) : null
  }

  const { data: targetPath } = useSWR(`/trigger/target/${trigger.target.id}`, getTargetItem)

  return {
    id: trigger.id,
    address: trigger.address,
    target: {
      id: trigger.target.id,
      type: trigger.target.type,
      path: targetPath
    },
    events: trigger.triggers
  }
} 