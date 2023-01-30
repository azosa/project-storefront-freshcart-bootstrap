import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, shareReplay, switchMap, tap } from 'rxjs';
import { CategoryModel } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-category-products',
  styleUrls: ['./category-products.component.scss'],
  templateUrl: './category-products.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryProductsComponent {
  readonly categories$: Observable<CategoryModel[]> = this._categoriesService
    .getAllCategories()
    .pipe(shareReplay(1));
  readonly category$: Observable<CategoryModel[] | any> =
    this._activatedRoute.params.pipe(
      switchMap((data) => {
        return this._categoriesService.getOneCategory(data['categoryId']);
      })
    );
  constructor(
    private _categoriesService: CategoriesService,
    private _activatedRoute: ActivatedRoute
  ) {}
}
