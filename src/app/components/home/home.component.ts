import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';
import { StoreTagModel } from 'src/app/models/store-tag.model';
import { StoreWithTagNamesQueryModel } from 'src/app/query-models/store-with-tag-names.query-model';
import { CategoryModel } from '../../models/category.model';
import { StoreModel } from '../../models/store.model';
import { CategoriesService } from '../../services/categories.service';
import { StoresService } from '../../services/stores.service';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly categories$: Observable<CategoryModel[]> = this._categoriesService.getAllCategories();


  readonly stores$: Observable<StoreWithTagNamesQueryModel[]> = combineLatest([
    this._storesService.getAllStores(),
    this._storesService.getStoreTags()
]).pipe(map(([stores,tags])=>{
 return this._mapToJobWithTagsQuery(stores,tags)
}))


  
private _mapToJobWithTagsQuery(stores:StoreModel[],tags:StoreTagModel[]):StoreWithTagNamesQueryModel[]{
  const storeTagsMap=tags.reduce((a,c)=>{
    return {...a,[c.id]:c}
  },{}) as Record<string,StoreTagModel>;
  return stores.map((store)=>({
    name:store.name,
    logoUrl: store.logoUrl,
    distanceInMeters:store.distanceInMeters/1000,
    id:store.id,
    tagNames:store.tagIds.map((tId)=>storeTagsMap[tId].name)
  }))
}


  constructor(private _categoriesService: CategoriesService, private _router: Router, private _activatedRoute: ActivatedRoute, private _storesService: StoresService) {
  }
}
