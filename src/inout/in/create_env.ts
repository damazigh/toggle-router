import { ExperimentToggle } from "src/db/model/toggle/experiment_toggle";
import { ReleaseToggle } from "src/db/model/toggle/release_toggle";
import { SupportedAppliesToForBasic } from "src/enum/constant";
import { CreateEnvEntityLight } from "./create-env-entity-light";

export class CreateEnv {
  name: string;
  description: string;
  secret: boolean;
  type: string;
  createdAt: Date;
  toggle?: ReleaseToggle | ExperimentToggle;
  appliesTo?: SupportedAppliesToForBasic;
  value?: string;
  entities?: CreateEnvEntityLight[];
}