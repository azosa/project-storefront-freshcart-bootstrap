export interface ProductWithStarsQueryModel {
  readonly name: string;
    readonly price: number;
    readonly categoryId: string;
    readonly ratingValue: number;
    readonly ratingStars: number[];
    readonly ratingCount: number;
    readonly imageUrl: string;
    readonly featureValue: number;
    readonly storeIds: string[];
    readonly id: string;
}
