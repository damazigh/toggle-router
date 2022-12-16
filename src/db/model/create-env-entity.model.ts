import { SupportedEntities } from "src/enum/constant";

export class CreateEnvEntity {
  entityType: SupportedEntities;
  entityId: string;
  value: string;
  toggleSortKey: string;
}