export class EnvOutput {
    key: string
    name: string
    description: string
    createdAt: number
    secret: boolean
    value: any
    type: string
    toggle: any

    constructor(item: any, toggle: any) {
      this.key = item.PK;
      this.name = item.name;
      this.description = item.description;
      this.createdAt = item.createdAtTimestamp;
      this.secret = item.secret;
      this.value = item.value;
      this.type = item.envType;
      this.toggle = toggle;
    }

}