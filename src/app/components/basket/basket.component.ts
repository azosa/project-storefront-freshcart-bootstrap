import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { combineLatest, map, Observable, of, tap } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { BasketService } from '../../services/basket.service';
import { BasketProductQueryModel } from 'src/app/query-models/basket-product.query-model';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketComponent {
  readonly basketProducts$: Observable<BasketProductQueryModel[]> =
    this._basketService.getAll();

  removeProd(id: string) {
    this._basketService.removeFromBasket(id);
  }

  onQuantityMinus(item: BasketProductQueryModel): void {
    this._basketService.changeQuantity(item.id, item.quantity - 1);
  }
  onQuantityPlus(item: BasketProductQueryModel): void {
    this._basketService.changeQuantity(item.id, item.quantity + 1);
  }
  onQuantityChange(id: string, event: Event): void {
    if (event.target != null) {
      this._basketService.changeQuantity(
        id,
        +(event.target as HTMLInputElement).value
      );
    }
  }

  public itemSubtotal$: Observable<number> = this.basketProducts$.pipe(
    map((items) =>
      items.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
    )
  );
  public serviceFee$: Observable<number> = of(3);

  public subtotal$: Observable<number> = combineLatest([
    this.itemSubtotal$,
    this.serviceFee$,
  ]).pipe(map(([itemSubtotal, serviceFee]) => itemSubtotal + serviceFee));

  constructor(
    private _basketService: BasketService
  ) {}
}
