export class EnvVariableItem {
    name: string
    description: string
    createdAt: string
    secret: boolean
    value: any

    constructor(item: any) {
      this.name = item.name;
      this.description = item.description;
      this.createdAt = item.createdAt;
      this.secret = item.secret;
      this.value = item.value;
    }

}