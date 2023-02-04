import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import {  map, shareReplay } from 'rxjs/operators';
import { CategoryModel } from '../../models/category.model';
import { ProductModel } from '../../models/product.model';
import { StoreWithTagNamesQueryModel } from '../../query-models/store-with-tag-names.query-model';
import { StoreModel } from '../../models/store.model';
import { StoreTagModel } from '../../models/store-tag.model';
import { CategoriesService } from '../../services/categories.service';
import { StoresService } from '../../services/stores.service';
import { ProductsService } from '../../services/products.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly categories$: Observable<CategoryModel[]> = this._categoriesService.getAllCategories().pipe(shareReplay(1));
  readonly allProducts$: Observable<ProductModel[]> = this._productsService.getAllProducts().pipe(shareReplay(1));


  readonly stores$: Observable<StoreWithTagNamesQueryModel[]> = combineLatest([
    this._storesService.getAllStores(),
    this._storesService.getStoreTags()
  ]).pipe(map(([stores, tags]) => {
    return this._mapToJobWithTagsQuery(stores, tags)
  }))

  private _mapToJobWithTagsQuery(stores: StoreModel[], tags: StoreTagModel[]): StoreWithTagNamesQueryModel[] {
    const storeTagsMap = tags.reduce((a, c) => {
      return { ...a, [c.id]: c }
    }, {}) as Record<string, StoreTagModel>;
    return stores.map((store) => ({
      name: store.name,
      logoUrl: store.logoUrl,
      distanceInMeters: store.distanceInMeters / 1000,
      id: store.id,
      tagNames: store.tagIds.map((tId) => storeTagsMap[tId].name)
    }))
  }

  readonly fruitVeggiesCategoryProducts$: Observable<ProductModel[]> =
    this.allProducts$.pipe(
      map((products) =>
        products
          .filter((product) => product.categoryId === '5')
          .sort((a, b) => {
            if (a.featureValue > b.featureValue) return -1;
            if (a.featureValue < b.featureValue) return 1;
            return 0;
          })
          .slice(0, 5)
      )
    );

  readonly snackMunchiesCategoryProducts$: Observable<ProductModel[]> =
    this.allProducts$.pipe(
      map((products) =>
        products
          .filter((product) => product.categoryId === '2')
          .sort((a, b) => {
            if (a.featureValue > b.featureValue) return -1;
            if (a.featureValue < b.featureValue) return 1;
            return 0;
          })
          .slice(0, 5)
      )
    );
  addToWishlist(item: ProductModel) {
    const el = [
      {
        name: item.name,
        price: String(item.price),
        amount: '1',
        unit: '',
        status: 'In Stock',
        imgUrl: item.imageUrl,
        id: item.id,
      },
    ];
    this._wishlistService.addProdToWishlist(el);
    this._router.navigate(['/wishlist']);
  }
  constructor(private _categoriesService: CategoriesService, private _router: Router, private _activatedRoute: ActivatedRoute, private _storesService: StoresService, private _productsService: ProductsService, private _wishlistService: WishlistService) {
  }
}
