export enum SupportedAppliesToForBasic {
  ALL = 'all',
  US_EAST_1 = 'us-east-1',
  EU_WEST_3 = 'eu-west-3',
}

export enum SupportedAppliesTo {
  ALL = 'all',
  US_EAST_1 = 'us-east-1',
  EU_WEST_3 = 'eu-west-3',
  GRANULAR = 'granular'
}

export enum SupportedEnvType {
  BASIC = 'basic',
  TOGGLE = 'toggle'
}

export enum SupportedToggleType {
  RELEASE_TOGGLE = 'release_toggle'
}

export const TABLE_NAME = 'ENV';

export const ENV_TYPE_INDEX = 'ENV_TYPE_INDEX';
export const ENV_TYPE = 'envType';