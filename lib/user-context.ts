export default class AppContext {

  private static instance: AppContext

  static get Current(): AppContext {
    if (!AppContext.instance && typeof window != 'undefined') AppContext.instance = new AppContext(window.localStorage)
    return AppContext.instance;
  }

  private storage: Storage

  constructor(storage) {
    this.storage = storage
  }

  get clientID(): string {
    return this.storage.getItem('box_client_id')
  }

  set clientID(id: string) {
    this.storage.setItem('box_client_id', id)
  }

  get clientSecret(): string {
    return this.storage.getItem('box_client_secret')
  }

  set clientSecret(secret: string) {
    this.storage.setItem('box_client_secret', secret)
  }

  get rootFolderID(): string {
    return this.storage.getItem('root_folder_id')
  }

  set rootFolderID(id: string) {
    this.storage.setItem('root_folder_id', id)
  }

  get serviceAccountID(): string {
    return this.storage.getItem('service_account_id')
  }

  set serviceAccountID(id: string) {
    this.storage.setItem('service_account_id', id)
  }
}