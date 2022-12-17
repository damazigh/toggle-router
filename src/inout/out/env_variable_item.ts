export class EnvVariableItem {
    name: string
    description: string
    createdAt: number
    secret: boolean
    value: any
    type: string

    constructor(item: any) {
      this.name = item.name;
      this.description = item.description;
      this.createdAt = item.createdAtTimestamp;
      this.secret = item.secret;
      this.value = item.value;
      this.type = item.envType;
    }

}