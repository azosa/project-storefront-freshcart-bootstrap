import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { StoreModel } from '../../models/store.model';
import { ProductModel } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { StoresService } from '../../services/stores.service';
import { BasketService } from '../../services/basket.service';
import { WishlistService } from '../../services/wishlist.service';

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
        : products.filter((prod) => prod.storeIds.includes(store.id))
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
  addToBasket(item: ProductModel) {
    const el = [
      {
        name: item.name,
        imgUrl: item.imageUrl,
        quantity:1,   
        id: item.id,
        price:item.price,
      },
    ];
    this._basketService.addtoBasket(el[0]);
    this._router.navigate(['/basket']);

  }

  constructor(
    private _productsService: ProductsService,
    private _activatedRoute: ActivatedRoute,
    private _storesService: StoresService, private _basketService: BasketService, private _router: Router, private _wishlistService: WishlistService
  ) { }
}
