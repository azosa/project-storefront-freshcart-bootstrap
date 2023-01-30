import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { ProductModel } from '../../models/product.model';
import { StoreModel } from '../../models/store.model';
import { ProductsService } from '../../services/products.service';
import { StoresService } from '../../services/stores.service';

@Component({
  selector: 'app-store-products',
  styleUrls: ['./store-products.component.scss'],
  templateUrl: './store-products.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreProductsComponent {
  readonly search: FormGroup = new FormGroup({
    searchMarket: new FormControl(),
  });

  readonly store$: Observable<StoreModel[] | any> =
    this._activatedRoute.params.pipe(
      switchMap((data) => {
        return this._storesService.getOneStore(data['storeId']);
      }),
      shareReplay(1)
    );

  readonly productsList$: Observable<ProductModel[]> = combineLatest([
    this._productsService.getAllProducts(),
    this.search.valueChanges.pipe(startWith('')),
    this.store$,
  ]).pipe(
    map(([products, search, store]) =>
      search.searchMarket
        ? products.filter(
            (prod) =>
              prod.name
                .toLowerCase()
                .includes(search.searchMarket.toLowerCase()) &&
              prod.storeIds.includes(store.id)
          )
        : products
    )
  );

  constructor(
    private _productsService: ProductsService,
    private _activatedRoute: ActivatedRoute,
    private _storesService: StoresService
  ) {}
}
