import { SupportedAppliesToForBasic, SupportedExperimentOperator } from "src/enum/constant";
import { Toggle } from "./toggle";

export class ExperimentToggle extends Toggle {
  appliesTo: SupportedAppliesToForBasic;
  operator: SupportedExperimentOperator;
  data: any;
}