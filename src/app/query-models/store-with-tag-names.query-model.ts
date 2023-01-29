export interface StoreWithTagNamesQueryModel {
  readonly name: string;
  readonly logoUrl: string;
  readonly distanceInMeters: number;
  readonly id: string;
  readonly tagNames: string[];
}
