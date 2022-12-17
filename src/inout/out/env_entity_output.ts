export class EnvEntityOutput {
    toggleSortKey: string
    entityId: string
    entityType: string
    value: any
    secret: boolean

    constructor(item: any) {
      this.toggleSortKey = item.SK;
      this.entityId = item.entityId;
      this.entityType = item.entityType;
      this.value = item.value;
    }

}