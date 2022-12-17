import { ReleaseToggle } from "src/db/model/toggle/release_toggle";
import { SupportedRegions } from "src/db/model/toggle/toggle";
import { CreateEnvEntityLight } from "./create-env-entity-light";

export class CreateEnv {
  name: string;
  description: string;
  secret: boolean;
  type: string;
  createdAt: Date;
  toggle?: ReleaseToggle;
  appliesTo?: SupportedRegions;
  value?: string;
  entities?: CreateEnvEntityLight[];
}