export class CreateEnvOutput {
    key: string
    toggleSortKey: string

    constructor(key: string, toggleSortKey?: string) {
      this.key = key;
      this.toggleSortKey = toggleSortKey
    }

}