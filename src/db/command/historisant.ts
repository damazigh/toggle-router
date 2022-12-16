export interface Historisant {
  historizeCreate(item): Promise<any>;
  historizeUpdate(oldItem, newItem): Promise<any>;
  mapItemToChange();
}