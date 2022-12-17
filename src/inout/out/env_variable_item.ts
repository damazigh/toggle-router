export class EnvVariableItem {
    key: string
    name: string
    description: string
    createdAt: number
    secret: boolean
    value: any
    type: string

    constructor(item: any) {
      this.key = item.PK;
      this.name = item.name;
      this.description = item.description;
      this.createdAt = item.createdAtTimestamp;
      this.secret = item.secret;
      this.value = item.value;
      this.type = item.envType;
    }

}