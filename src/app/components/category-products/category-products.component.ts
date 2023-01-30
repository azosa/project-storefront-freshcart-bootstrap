import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  combineLatest,
  Observable,
  filter,
  map,
  shareReplay,
  switchMap,
  tap,
  of,
} from 'rxjs';
import { ProductWithStarsQueryModel } from 'src/app/query-models/product-with-stars.query-model';
import { CategoryModel } from '../../models/category.model';
import { ProductModel } from '../../models/product.model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

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
      }),
      shareReplay(1)
    );

  readonly products$: Observable<ProductWithStarsQueryModel[]> = combineLatest([
    this._productsService.getAllProducts(),
    this.category$,
  ]).pipe(
    map(([products, category]) => {
      return products
        .filter((product) => product.categoryId === category.id)
        .map((prod) => ({
          name: prod.name,
          price: prod.price,
          categoryId: prod.categoryId,
          ratingValue: prod.ratingValue,
          ratingStars: this.getRating(prod.ratingValue),
          ratingCount: prod.ratingCount,
          imageUrl: prod.imageUrl,
          featureValue: prod.featureValue,
          storeIds: prod.storeIds,
          id: prod.id,
        }));
    })
  );

  private getRating(val: number) {
    let result = [];
    let fP = Math.trunc(val);
    let lP = Number((val - fP).toFixed(1));
    for (let i = 0; i < fP; i++) {
      result.push(1);
    }
    if (lP > 0) result.push(0.5);

    if (result.length < 5) {
      for (let i = 0; result.length < 5; i++) {
        result.push(0);
      }
    }

    return result;
  }

  constructor(
    private _categoriesService: CategoriesService,
    private _activatedRoute: ActivatedRoute,
    private _productsService: ProductsService
  ) {}
}
