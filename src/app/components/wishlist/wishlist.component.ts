import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import { WishlistProductQueryModel } from 'src/app/query-models/wishlist-product.query-model';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistComponent {
  readonly wishlistProducts$: Observable<WishlistProductQueryModel[]> =
    this._wishlistService.getAll();
  constructor(private _wishlistService: WishlistService) {}
  removeProd(id: string) {
    this._wishlistService.removeProdFromWishlist(id);
  }
  addToCart(id: string) {}
}
