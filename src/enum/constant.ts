export enum SupportedAppliesToForBasic {
  ALL = 'ALL',
  US_EAST_1 = 'US-EAST-1',
  EU_WEST_3 = 'EU-WEST-3',
}

export enum SupportedAppliesTo {
  ALL = 'ALL',
  US_EAST_1 = 'US-EAST-1',
  EU_WEST_3 = 'EU-WEST-3',
  GRANULAR = 'GRANULAR'
}

export enum SupportedEnvType {
  BASIC = 'BASIC',
  TOGGLE = 'TOGGLE'
}

export enum SupportedToggleType {
  RELEASE_TOGGLE = 'RELEASE_TOGGLE'
}

export enum SupportedEntities {
  PROJECT = 'PROJECT',
  ACCOUNT = 'ACCOUNT'
}

export const TABLE_NAME = 'ENV';

export enum GlobalSecondaryIndexes {
  ENV_TYPE_INDEX = 'ENV_TYPE_INDEX',
  TOGGLE_TYPE_INDEX = 'TOGGLE_TYPE_INDEX'
}
