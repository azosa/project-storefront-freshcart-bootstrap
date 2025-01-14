import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
  take,
} from 'rxjs';
import { QueryParamsModel } from '../../models/query-params.model';
import { CategoryModel } from '../../models/category.model';
import { ProductWithStarsQueryModel } from '../../query-models/product-with-stars.query-model';
import { StoreModel } from '../../models/store.model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { StoresService } from '../../services/stores.service';

@Component({
  selector: 'app-category-products',
  styleUrls: ['./category-products.component.scss'],
  templateUrl: './category-products.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryProductsComponent {
  readonly pageQueryParams$: Observable<QueryParamsModel> =
    this._activatedRoute.queryParams.pipe(
      map((params) => ({
        pageNumber: params['pageNumber'] ? +params['pageNumber'] : 1,
        pageSize: params['pageSize'] ? +params['pageSize'] : 5,
        pageSizeOptions: [5, 10, 15],
      }))
    );
  readonly sortBySelect: FormGroup = new FormGroup({
    select: new FormControl('featured'),
  });
  readonly search: FormGroup = new FormGroup({
    searchStore: new FormControl(),
  });
  readonly filterProductsByPrice: FormGroup = new FormGroup({
    priceFrom: new FormControl(),
    priceTo: new FormControl(),
  });
  readonly ratingByStar: FormGroup = new FormGroup({
    rating: new FormControl(),
  });
  readonly filterByStore: FormGroup = new FormGroup({});

  readonly filterByPriceValueChanges$: Observable<any> =
    this.filterProductsByPrice.valueChanges.pipe(
      startWith({ priceFrom: 0, priceTo: 9999 }),
      shareReplay(1)
    );
  readonly filterByStarRatingValueChanges$: Observable<any> =
    this.ratingByStar.valueChanges.pipe(startWith(0), shareReplay(1));

  readonly stores$: Observable<StoreModel[]> = this._storesService
    .getAllStores()
    .pipe(shareReplay(1));
  createFormControl(stores: StoreModel[]) {
    stores.forEach((store) =>
      this.filterByStore.addControl(store.id, new FormControl(false))
    );
  }
  readonly storesFiltered$: Observable<StoreModel[]> = combineLatest([
    this.stores$,
    this.search.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([stores, search]) =>
      search.searchStore
        ? stores.filter((store) =>
            store.name.toLowerCase().includes(search.searchStore.toLowerCase())
          )
        : stores
    ),
    tap((stores) => {
      this.createFormControl(stores);
    })
  );

  readonly filterByStoreValueChanges$: Observable<any> =
    this.filterByStore.valueChanges.pipe(
      map((store) => {
        return Object.keys(store).filter((id) => store[id] == true);
      }),
      shareReplay(1)
    );

  private _activePageSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(1);
  public activePage$: Observable<number> =
    this._activePageSubject.asObservable();

  private _activePageSizeSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(5);
  public activePageSize$: Observable<number> =
    this._activePageSizeSubject.asObservable();

  readonly categories$: Observable<CategoryModel[]> = this._categoriesService
    .getAllCategories()
    .pipe(shareReplay(1));
  readonly category$: Observable<CategoryModel[] | any> =
    this._activatedRoute.params.pipe(
      switchMap((data) => {
        return this._categoriesService.getOneCategory(data['categoryId']);
      }),
      shareReplay(1)
    );

  readonly products$: Observable<ProductWithStarsQueryModel[]> = combineLatest([
    this._productsService.getAllProducts(),
    this.category$,
    this.sortBySelect.valueChanges.pipe(startWith('featured')),
    this.filterByPriceValueChanges$,
    this.filterByStarRatingValueChanges$,
    this.filterByStoreValueChanges$,
  ]).pipe(
    map(
      ([
        products,
        category,
        sortBySelect,
        filters,
        ratingStar,
        store,
      ]) => {
        return products
          .filter((product) =>
            store?.length > 0
              ? product.storeIds.some((sId) => store.includes(sId))
              : product
          )
          .filter((product) =>
            ratingStar != 0
              ? Math.trunc(product.ratingValue) == ratingStar.rating
              : product.ratingValue > 0
          )
          .filter((product) =>
            filters.priceFrom
              ? product.price >= filters.priceFrom
              : product.price > 0
          )
          .filter((product) =>
            filters.priceTo
              ? product.price <= filters.priceTo
              : product.price < 9999
          )
          .filter((product) => product.categoryId === category.id)
          .sort((a, b) => {
            if (
              sortBySelect.select === 'featured' ||
              sortBySelect == 'featured'
            ) {
              return a.featureValue > b.featureValue ? -1 : 1;
            }

            if (sortBySelect.select === 'Low to High') {
              return a.price > b.price ? 1 : -1;
            }

            if (sortBySelect.select === 'High to Low') {
              return a.price > b.price ? -1 : 1;
            }

            if (sortBySelect.select === 'Avg. Rating') {
              return a.ratingValue > b.ratingValue ? -1 : 1;
            }
            return 0;
          })
          .map((prod) => ({
            name: prod.name,
            price: prod.price,
            categoryId: prod.categoryId,
            ratingValue: prod.ratingValue,
            ratingStars: this.getRating(prod.ratingValue),
            ratingCount: prod.ratingCount,
            imageUrl: prod.imageUrl,
            featureValue: prod.featureValue,
            storeIds: prod.storeIds,
            id: prod.id,
          }));
      }
    ),
    shareReplay(1)
  );

  readonly paginatedProductsList$: Observable<ProductWithStarsQueryModel[]> =
    combineLatest([this.products$, this.pageQueryParams$]).pipe(
      map(([products, params]) =>
        products.slice(
          params.pageSize * (params.pageNumber - 1),
          params.pageNumber * params.pageSize
        )
      )
    );

  private getRating(val: number) {
    let result = [];
    let fP = Math.trunc(val);
    let lP = Number((val - fP).toFixed(1));
    for (let i = 0; i < fP; i++) {
      result.push(1);
    }
    if (lP > 0) result.push(0.5);

    if (result.length < 5) {
      for (let i = 0; result.length < 5; i++) {
        result.push(0);
      }
    }

    return result;
  }

  readonly pages$: Observable<number[]> = combineLatest([
    this.products$,
    this.pageQueryParams$,
  ]).pipe(
    map(([products, params]) => {
      let result: number[] = [];

      for (let i = 1; i <= Math.ceil(products.length / params.pageSize); i++) {
        result.push(i);
      }
      return result;
    })
  );

  onPageSizeChange(value: number) {
    this._activePageSizeSubject.next(value);
    this.pageQueryParams$
      .pipe(
        take(1),
        tap((params) => {
          this._router.navigate([], {
            queryParams: {
              pageNumber: params.pageNumber,
              pageSize: value,
            },
          });
        })
      )
      .subscribe();
  }

  onPageChange(value: number) {
    this._activePageSubject.next(value);
    this.pageQueryParams$
      .pipe(
        take(1),
        tap((params) => {
          this._router.navigate([], {
            queryParams: {
              pageNumber: value,
              pageSize: params.pageSize,
            },
          });
        })
      )
      .subscribe();
  }
  constructor(
    private _categoriesService: CategoriesService,
    private _activatedRoute: ActivatedRoute,
    private _productsService: ProductsService,
    private _router: Router,
    private _storesService: StoresService
  ) {}
}
