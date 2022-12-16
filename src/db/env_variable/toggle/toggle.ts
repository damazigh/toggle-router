import { uuid } from "uuidv4";

export abstract class Toggle {

  constructor() {
    this.id = uuid();
  }
  toggleType: 'release_toggle' | 'experiment_toggle' | 'ops_toggle';
  appliesTo: SupportedRegions;
  id: string;
}

export type SupportedRegions = 'all' | 'us-east-1' | 'eu-west-3' | 'granular';