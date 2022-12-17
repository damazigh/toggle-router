export class HistoryOutput {
    key: string
    event: string
    changes: any

    constructor(item: any) {
        this.key = item.PK;
        this.event = item.event;
        this.changes = item.changes;
    }
}