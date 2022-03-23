import useSWR, { mutate } from "swr"
import { IBoxWebhook } from "../common/box-types"
import { BoxClient, getItemFullPath } from "./box-api"
import { ITrigger, ITriggerConfig } from "./box-function"
import UserContext from "./user-context"
import { UserSession } from "./user-session"


export function useTriggerList() {

  async function listTriggers() {
    const { entries: w } = await new BoxClient(UserContext.Current).listWebhooks()
    return w
  }

  const { data, error } = useSWR('/triggers', listTriggers)

  async function createTrigger(config: ITriggerConfig): Promise<ITrigger> {
    const boxClient = new BoxClient(UserContext.Current)
    const address = `${window.location.origin}/api/function/${this.id}/run`
    return boxClient.createWebhook({
      address,
      target: {
        id: config.target.id,
        type: config.target.type as string
      },
      triggers: config.events
    })
  }

  async function deleteTrigger(triggerId: string): Promise<void> {
    const boxClient = new BoxClient(UserContext.Current)
    return boxClient.deleteWebhook(triggerId)
  }


  return { triggers: data, error, createTrigger, deleteTrigger }
}


export function useTrigger(trigger: IBoxWebhook) {

  async function getTrigger() {
    return await UserSession.Current.BoxClient.getWebhook(trigger.id)
  }

  const { data: webhook } = useSWR(`/trigger/${trigger.id}`, getTrigger)

  async function getTargetItem() {
    let target = null;
    target = trigger.target.type === 'file' ? await UserSession.Current.BoxClient.getFileInfo(trigger.target.id, 'name,path_collection') : null
    target = trigger.target.type === 'folder' ? await UserSession.Current.BoxClient.getFolderInfo(trigger.target.id, 'name,path_collection') : null
    return target ? getItemFullPath(target) : null
  }

  const { data: targetPath } = useSWR(`/trigger/target/${trigger.target.id}`, getTargetItem)

  return {
    id: trigger.id,
    address: webhook?.address,
    target: {
      id: trigger.target.id,
      type: trigger.target.type,
      path: targetPath
    },
    events: webhook?.triggers
  }
} 