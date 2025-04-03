import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { ArticleCreationRoutingModule } from './article-creation-routing.module';
import { ArticleCreationListComponent } from "./article-creation-list/article-creation-list.component";


@NgModule({
	declarations: [
		ArticleCreationListComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		SharedModule,
		ArticleCreationRoutingModule
	]
})
export class ArticleCreationModule { }