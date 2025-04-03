import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleCreationListComponent } from './article-creation-list/article-creation-list.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Article Creation' },
    children: [
      {
        path: 'list',
        component: ArticleCreationListComponent,
        data: { breadcrumb: 'List' }
      }
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleCreationRoutingModule {


}


