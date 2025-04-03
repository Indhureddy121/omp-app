import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from "@ng-select/ng-select";
import { SharedModule } from "@shared/shared.module";
import { PetscreenHistoryComponent } from "./petscreen-history/petscreen-history.component";
import { PetscreenListComponent } from "./petscreen-list/petscreen-list.component";
import { PETScreenRoutingModule } from "./petscreen.routing";
import { PetscreenbtnPipe } from './petscreenbtn.pipe';


@NgModule({
	declarations: [	
        PetscreenHistoryComponent,
        PetscreenListComponent,
      PetscreenbtnPipe
   ],
	imports: [
		CommonModule,
        PETScreenRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		SharedModule,
		NgbModule
	]
})
export class PETScreenModule { }