export abstract class Toggle {
  toggleType: 'release_toggle' | 'experiment_toggle' | 'ops_toggle';
  appliesTo: SupportedRegions;
  id: string;
}

export type SupportedRegions = 'all' | 'us-east-1' | 'eu-west-3' | 'granular';