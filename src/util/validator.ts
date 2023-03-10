import { UnprocessableEntityException } from "@nestjs/common";

export class Validator {

  public static require<T>(object: T, key: string) {
    if (!object[key])
      throw new UnprocessableEntityException(`parameter '${key}' is required`);
  }

  public static isInEnum(object, key, ptype) {
    if (!Object.values(ptype).includes(object[key]))
      throw new UnprocessableEntityException(`Unsupported value '${object[key]}' for parameter '${key}' - supported values: ${Object.values(ptype)}`);
  }

  public static maxLength(arr: any[], maxLength: number) {
    if(arr && arr.length > maxLength) {
      throw new UnprocessableEntityException(`Maximum size is ${maxLength}`);
    }
  }

  public static notPresent(obj: any, field: string) {
    if (!!obj[field]) {
      throw new UnprocessableEntityException(`Field ${field} is not authorized in the current context`);
    }
  }
}