import { SupportedToggleType } from "src/enum/constant";
import { uuid } from "uuidv4";

export abstract class Toggle {

  constructor() {
    this.id = uuid();
  }
  toggleType: SupportedToggleType;
  id: string;
}