import axios from "axios";
import { BoxClient } from "./box-api";
import { IBoxItemType, IBoxItem, IBoxJsonWebToken, IBoxUserToken, IBoxCredentialType } from "../common/box-types";
import AppConfig from "../../conf/app.config"
import UserContext from "./user-context";


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


export class BoxFunction {

  static async list() {
    const context = UserContext.Current
    const boxClient = new BoxClient(context)
    const { entries: f } = await boxClient.listFolderItems(context.rootFolderID)
    return f
  }

  static async create(name) {
    const context = UserContext.Current
    const boxClient = new BoxClient(context)

    const fn = await boxClient.createFolder(name, context.rootFolderID)
    await boxClient.uploadFile(fn.id, AppConfig.source.filename, AppConfig.source.template)
    await boxClient.uploadFile(fn.id, AppConfig.settings.filename, JSON.stringify(AppConfig.settings.template))

    return fn
  }

  static async load(id: string): Promise<BoxFunction> {
    const boxClient = new BoxClient(UserContext.Current)

    const folder = await boxClient.getFolderInfo(id)
    const { entries: folderItems } = await boxClient.listFolderItems(id)
    const [sourceFile] = folderItems.filter(i => i.name == AppConfig.source.filename)
    const [settingsFile] = folderItems.filter(i => i.name == AppConfig.settings.filename)

    return new BoxFunction(folder, sourceFile, settingsFile)
  }

  static async delete(id: string) {
    const fn = await BoxFunction.load(id)
    return await fn.delete()
  }

  private readonly folder: IBoxItem
  private readonly sourceFile: IBoxItem
  private readonly settingsFile: IBoxItem


  private constructor(folder, sourceFile, settingsFile) {
    this.folder = folder
    this.sourceFile = sourceFile
    this.settingsFile = settingsFile
  }

  get id(): string {
    return this.folder.id
  }

  get name(): string {
    return this.folder.name
  }

  getSource() {
    const boxClient = new BoxClient(UserContext.Current)
    return boxClient.downloadFile(this.sourceFile.id)
  }

  updateSource(text: string) {
    const boxClient = new BoxClient(UserContext.Current)
    return boxClient.uploadFileVersion(this.sourceFile.id, text)
  }

  async run(payload: object): Promise<string> {
    return axios({
      method: 'post',
      url: `/api/function/${this.id}/run`,
      data: payload
    }).then(res => res.data)
  }

  async getSettings(): Promise<IBoxFunctionSettings> {
    const boxClient = new BoxClient(UserContext.Current)
    const settingsJson = await boxClient.downloadFile(this.settingsFile.id)
    return JSON.parse(settingsJson)
  }

  async updateSettings(settings: IBoxFunctionSettings) {
    const boxClient = new BoxClient(UserContext.Current)
    return boxClient.uploadFileVersion(this.settingsFile.id, JSON.stringify(settings))
  }

  async createTrigger(config: ITriggerConfig): Promise<ITrigger> {
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

  async deleteTrigger(triggerId: string): Promise<void> {
    const boxClient = new BoxClient(UserContext.Current)
    return boxClient.deleteWebhook(triggerId)
  }

  async delete() {
    const { triggers } = await this.getSettings()
    triggers.forEach(t => this.deleteTrigger(t.id))

    const boxClient = new BoxClient(UserContext.Current)
    return await boxClient.deleteFolder(this.id)
  }
}