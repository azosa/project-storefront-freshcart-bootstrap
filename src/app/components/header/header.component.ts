import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
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
    private _wishlistService: WishlistService
  ) {}
}
