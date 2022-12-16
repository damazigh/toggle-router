import { ReleaseToggle } from "./toggle/release_toggle";
import { SupportedRegions } from "./toggle/toggle";

export class CreateEnv {
  name: string;
  description: string;
  secret: boolean;
  type: string;
  createdAt: Date;
  toggle?: ReleaseToggle
  appliesTo?: SupportedRegions
}