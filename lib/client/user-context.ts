export default class UserContext {

  private static instance: UserContext

  static get Current(): UserContext {
    if (!UserContext.instance && typeof window != 'undefined') UserContext.instance = new UserContext(window.localStorage)
    return UserContext.instance;
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