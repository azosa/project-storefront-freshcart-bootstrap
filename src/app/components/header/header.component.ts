import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  shareReplay,
  map,
  tap,
} from 'rxjs';
import { BasketService } from 'src/app/services/basket.service';
import { CategoryModel } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  wishlistProdsNum: number = 0;
  private wishlistProds = this._wishlistService.wishlistList$.subscribe(
    (result) => {
      this.wishlistProdsNum = result.length;
    }
  );

  public basketProdsNum: number = 0;
  private basketProds = this._basketService
    .getAll()
    .pipe(
      map((items) => items.reduce((acc, cur) => acc + cur.quantity, 0)),
      tap((data) => (this.basketProdsNum = data))
    )
    .subscribe();

  readonly categories$: Observable<CategoryModel[]> = this._categoriesService
    .getAllCategories()
    .pipe(shareReplay(1));
  private _mobileMenuSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public mobileMenu$: Observable<boolean> =
    this._mobileMenuSubject.asObservable();
  onClickMobileMenu(showMenu: boolean) {
    this._mobileMenuSubject.next(showMenu);
  }
  constructor(
    private _categoriesService: CategoriesService,
    private _wishlistService: WishlistService,
    private _basketService: BasketService
  ) {}
}
