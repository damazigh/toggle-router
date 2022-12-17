import { SupportedEntities } from "src/enum/constant";

export class CreateEnvEntityLight {
  entityType: SupportedEntities;
  entityId: string;
  value: string;
}