export class ToggleOutput {
    toggleSortKey: string
    toggleType: string
    appliesTo: string

    constructor(item: any) {
        this.toggleSortKey = item.SK;
        this.toggleType = item.toggleType;
        this.appliesTo = item.appliesTo;
    }
}