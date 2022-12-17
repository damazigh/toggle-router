import { SupportedEntities } from "src/enum/constant";
import { CreateEnvEntityLight } from "./create-env-entity-light";

export class CreateEnvEntity {
  entityType: SupportedEntities;
  entityId: string;
  value: string;
  toggleSortKey: string;

  static fromLight(entityLight: CreateEnvEntityLight, toggleSortKey: string) {
    const entity = new CreateEnvEntity();
    entity.entityId = entityLight.entityId;
    entity.entityType = entityLight.entityType;
    entity.value = entityLight.value;
    entity.toggleSortKey = toggleSortKey;
    return entity;
  }
}