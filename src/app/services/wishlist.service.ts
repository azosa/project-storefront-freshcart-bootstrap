import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, shareReplay } from 'rxjs';
import { WishlistProductQueryModel } from '../query-models/wishlist-product.query-model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  constructor() {}

  private localStorageKey: string = 'wishListItems';
  private _wishlistListBehaviorSubject: BehaviorSubject<
    WishlistProductQueryModel[]
  > = new BehaviorSubject<WishlistProductQueryModel[]>(
    this.getProductsFromLocalStorage()
  );
  public wishlistList$: Observable<WishlistProductQueryModel[]> =
    this._wishlistListBehaviorSubject.asObservable().pipe(
      tap((products) =>
        window.localStorage.setItem(
          this.localStorageKey,
          JSON.stringify(products)
        )
      ),
      shareReplay(1)
    );

  getAll(): Observable<WishlistProductQueryModel[]> {
    return this.wishlistList$;
  }

  addProdToWishlist(prod: WishlistProductQueryModel[]) {
    const localStorageProduts = this.getProductsFromLocalStorage();
    if (
      !this._wishlistListBehaviorSubject.value.find(
        (product) => product.id === prod[0].id
      )
    ) {
      const newItems = localStorageProduts.push(prod[0]);
      window.localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(newItems)
      );
      this._wishlistListBehaviorSubject.next(
        this._wishlistListBehaviorSubject.getValue().concat(prod)
      );
    }
  }

  removeProdFromWishlist(id: string) {
    const newWishlistProducts = this._wishlistListBehaviorSubject.value.filter(
      (product) => product.id !== id
    );
    this._wishlistListBehaviorSubject.next(newWishlistProducts);
  }

  getProductsFromLocalStorage(): WishlistProductQueryModel[] {
    const localStorageProducts = window.localStorage.getItem(
      this.localStorageKey
    );

    if (localStorageProducts != null) return JSON.parse(localStorageProducts);
    return [];
  }
}
