export interface Historisant {
  historize(item): Promise<any>;
  mapItemToChange(event: string);
}