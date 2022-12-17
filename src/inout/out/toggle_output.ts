export class ToggleOutput {
    key: string
    toggleType: string
    appliesTo: string

    constructor(item: any) {
        this.key = item.SK;
        this.toggleType = item.toggleType;
        this.appliesTo = item.appliesTo;
    }
}