import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { combineLatest, map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { WishlistProductQueryModel } from '../../query-models/wishlist-product.query-model';
import { ProductModel } from '../../models/product.model';
import { WishlistService } from '../../services/wishlist.service';
import { BasketService } from '../../services/basket.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistComponent {
  readonly wishlistProducts$: Observable<WishlistProductQueryModel[]> =
    this._wishlistService.getAll();

  constructor(
    private _wishlistService: WishlistService,
    private _basketService: BasketService,
    private _router: Router,
  ) {}
  removeProd(id: string) {
    this._wishlistService.removeProdFromWishlist(id);
  }

  addToCart(item: WishlistProductQueryModel) {
    const el = [
      {
        name: item.name,
        imgUrl: item.imgUrl,
        quantity:1,   
        id: item.id,
        price:+item.price,
      },
    ];
    this._basketService.addtoBasket(el[0]);
    this._router.navigate(['/basket']);
  }
}
