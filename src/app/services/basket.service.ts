import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, shareReplay } from 'rxjs';
import { ProductModel } from '../models/product.model';
import { BasketProductQueryModel } from '../query-models/basket-product.query-model';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private localStorageKey: string = 'basketItems';
  private _basketBehaviorSubject: BehaviorSubject<BasketProductQueryModel[]> =
    new BehaviorSubject<BasketProductQueryModel[]>(
      this.getProductsFromLocalStorage()
    );
  public basket$: Observable<BasketProductQueryModel[]> =
    this._basketBehaviorSubject.asObservable().pipe(
      tap((products) =>
        window.localStorage.setItem(
          this.localStorageKey,
          JSON.stringify(products)
        )
      ),
      shareReplay(1)
    );
  getAll(): Observable<BasketProductQueryModel[]> {
    return this.basket$;
  }
  getProductsFromLocalStorage(): BasketProductQueryModel[] {
    const localStorageProducts = window.localStorage.getItem(
      this.localStorageKey
    );

    if (localStorageProducts != null) return JSON.parse(localStorageProducts);
    return [];
  }
  addtoBasket(prod: BasketProductQueryModel) {
    const localStorageProduts = this.getProductsFromLocalStorage();
    const isProd = this._basketBehaviorSubject.value.find(
      (product) => product.id === prod.id
    );
    if (isProd) {
      this.changeQuantity(prod.id, isProd.quantity + prod.quantity);
    } else {
      const newItems = localStorageProduts.push(prod);
      window.localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(newItems)
      );
      this._basketBehaviorSubject.next(
        this._basketBehaviorSubject.getValue().concat(prod)
      );
    }
  }
  removeFromBasket(id: string) {
    const basketProducts = this._basketBehaviorSubject.value.filter(
      (product) => product.id !== id
    );
    this._basketBehaviorSubject.next(basketProducts);
  }

  changeQuantity(id: string, quantity: number): void {
    const basketProducts = this._basketBehaviorSubject.value.map((product) => {
      if (product.id !== id) return product;

      return {
        name: product.name,
        imgUrl: product.imgUrl,
        quantity: quantity,
        id: product.id,
        price: product.price,
      };
    });

    this._basketBehaviorSubject.next(basketProducts);
  }
}
