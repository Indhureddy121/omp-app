import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApprovalmatrixComponent } from './pages/approvalmatrix/approvalmatrix.component';
import { PriceconfigurationComponent } from './pages/priceconfiguration/priceconfiguration.component';
import { ManagerolesComponent } from './pages/roles/roles/manageroles.component';
import { AdditionalchargesListComponent } from './pages/additionalcharges/additionalcharges-list/additionalcharges-list.component';
import { AdditionalchargesComponent } from './pages/additionalcharges/additionalcharges/additionalcharges.component';
import { RolesListComponent } from './pages/roles/roles-list/roles-list.component';
import { PortComponent } from './pages/port/port/port.component';
import { PortListComponent } from './pages/port/port-list/port-list.component';
import { ImportcopperindexComponent } from './pages/importcopperindex/importitemcopperindex/importcopperindex.component';
import { ImportcopperindexhistoryComponent } from './pages/importcopperindex/importcopperindexhistory/importcopperindexhistory.component';
import { ImportCopperIndexService } from '@core/services/masters/import-copper-index.service';
import { ImportratecontractComponent } from './pages/ratecontract/importratecontract/importratecontract.component';
import { RatecontracthistoryComponent } from './pages/ratecontract/ratecontracthistory/ratecontracthistory.component';
import { ImportrmcostComponent } from './pages/rmcostmaster/importrmcost/importrmcost.component';
import { RmcosthistoryComponent } from './pages/rmcostmaster/rmcosthistory/rmcosthistory.component';
import { ImportfreightfactorComponent } from './pages/freightfactor/importfreightfactor/importfreightfactor.component';
import { FreightfactorhistoryComponent } from './pages/freightfactor/freightfactorhistory/freightfactorhistory.component';
import { HsnmasterHistoryComponent } from './pages/hsnmaster/hsnmaster-history/hsnmaster-history.component';
import { ProductmasterComponent } from './pages/productmaster/productmaster-list/productmaster.component';
import { ProductmasterHistoryComponent } from './pages/productmaster/productmaster-history/productmaster-history.component';
import { HsnmasterListComponent } from './pages/hsnmaster/hsnmaster-list/hsnmaster-list.component';
import { ScreenAssignmentComponent } from './pages/screen-assignment/screen-assignment.component';
import { MarginListComponent } from './pages/margin/margin-list/margin-list.component';
import { MarginHistoryComponent } from './pages/margin/margin-history/margin-history.component';
import { AlpmasterListComponent } from './pages/alpmaster/alpmaster-list/alpmaster-list.component';
import { AlpmasterHistoryComponent } from './pages/alpmaster/alpmaster-history/alpmaster-history.component';
import { CostmasterstdListComponent } from './pages/costmasterstd/costmasterstd-list/costmasterstd-list.component';
import { CostmasterstdHistoryComponent } from './pages/costmasterstd/costmasterstd-history/costmasterstd-history.component';
import { CostmastertrdListComponent } from './pages/costmastertrd/costmastertrd-list/costmastertrd-list.component';
import { CostmastertrdHistoryComponent } from './pages/costmastertrd/costmastertrd-history/costmastertrd-history.component';
import { PriceconfigurationAlpComponent } from './pages/priceconfiguration-alp/priceconfiguration-alp.component';
import { ProductmasterDownloadsComponent } from './pages/productmaster/productmaster-downloads/productmaster-downloads.component';
import { CostmasterstdDownloadsComponent } from './pages/costmasterstd/costmasterstd-downloads/costmasterstd-downloads.component';
import {CostmastertrdDownloadsComponent} from './pages/costmastertrd/costmastertrd-downloads/costmastertrd-downloads.component';
import { HsnmasterDownloadsComponent } from './pages/hsnmaster/hsnmaster-downloads/hsnmaster-downloads.component';
import { MoqComponent } from './pages/moq/moq.component';

const routes: Routes = [
  {
    path: 'roles',
    data: { breadcrumb: 'Roles' },
    children: [
      {
        path: 'add',
        component: ManagerolesComponent,
        data: { breadcrumb: 'Add' }
      },
      {
        path: 'edit/:id',
        component: ManagerolesComponent,
        data: { breadcrumb: 'Edit' }
      },
      {
        path: 'view/:id',
        component: ManagerolesComponent,
        data: { breadcrumb: 'View' }
      },
      {
        path: 'list',
        component: RolesListComponent,
        data: { breadcrumb: 'List' }
      }
    ]
  },
  {
    path: 'priceconfiguration',
    data: { breadcrumb: 'Price Configuration' },
    children: [
      {
        path: 'add',
        component: PriceconfigurationComponent,
        data: { breadcrumb: 'Add' }
      }
    ]
  },
  {
    path: 'importcopperindex',
    data: { breadcrumb: 'Import Copper Index' },
    children: [
      {
        path: 'list',
        component: ImportcopperindexComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'logs',
        component: ImportcopperindexhistoryComponent,
        data: { breadcrumb: 'Logs' }
      }
    ]
  },
  {
    path: 'approvalmatrix',
    data: { breadcrumb: 'Approval Matrix' },
    children: [
      {
        path: 'list',
        component: ApprovalmatrixComponent,
        data: { breadcrumb: 'List' }
      }
    ]
  },
  {
    path: 'ratecontract',
    data: { breadcrumb: 'Manage Rate Contract' },
    children: [
      {
        path: 'list',
        component: ImportratecontractComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'logs',
        component: RatecontracthistoryComponent,
        data: { breadcrumb: 'Logs' }
      }
    ]
  },
  {
    path: 'rmcostmaster',
    data: { breadcrumb: 'Cost Master' },
    children: [
      {
        path: 'list',
        component: ImportrmcostComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'logs',
        component: RmcosthistoryComponent,
        data: { breadcrumb: 'Logs' }
      }
    ]
  },
  {
    path: 'productmaster',
    data: { breadcrumb: 'Product Master' },
    children: [
      {
        path: 'list',
        component: ProductmasterComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'list/view',
        component: ProductmasterComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'logs',
        component: ProductmasterHistoryComponent,
        data: { breadcrumb: 'Logs' }
      },
      {
        path: 'downloads',
        component: ProductmasterDownloadsComponent,
        data: { breadcrumb: 'Downloads' }
      }
    ]
  },
  {
    path: 'freightfactormaster',
    data: { breadcrumb: 'Freight Factor' },
    children: [
      {
        path: 'list',
        component: ImportfreightfactorComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'list/view',
        component: ImportfreightfactorComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'logs',
        component: FreightfactorhistoryComponent,
        data: { breadcrumb: 'Logs' }
      }
    ]
  },
  {
    path: 'hsnmaster',
    data: { breadcrumb: 'HSN Master' },
    children: [
      {
        path: 'list',
        component: HsnmasterListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'list/view',
        component: HsnmasterListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'logs',
        component: HsnmasterHistoryComponent,
        data: { breadcrumb: 'Logs' }
      },
      {
        path: 'downloads',
        component: HsnmasterDownloadsComponent,
        data: { breadcrumb: 'Downloads' }
      }
    ]
  },
  {
    path: 'screenassignment',
    data: { breadcrumb: 'Assign Screens' },
    children: [
      {
        path: 'list',
        component: ScreenAssignmentComponent,
        data: { breadcrumb: 'List' }
      }
    ]
  },
  {
    path: 'margin',
    data: { breadcrumb: 'Margin' },
    children: [
      {
        path: 'list',
        component: MarginListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'list/view',
        component: MarginListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'logs',
        component: MarginHistoryComponent,
        data: { breadcrumb: 'Logs' }
      }
    ]
  },
  {
    path: 'alpmaster',
    data: { breadcrumb: 'ALP Master' },
    children: [
      {
        path: 'list',
        component: AlpmasterListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'list/view',
        component: AlpmasterListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'logs',
        component: AlpmasterHistoryComponent,
        data: { breadcrumb: 'Logs' }
      }
    ]
  },
  {
    path: 'costmasterstd',
    data: { breadcrumb: 'Cost Master MFG' },
    children: [
      {
        path: 'list',
        component: CostmasterstdListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'list/view',
        component: CostmasterstdListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'logs',
        component: CostmasterstdHistoryComponent,
        data: { breadcrumb: 'Logs' }
      },
	  {
        path: 'downloads',
        component: CostmasterstdDownloadsComponent,
        data: { breadcrumb: 'Downloads' }
      }
    ]
  },
  {
    path: 'costmastertrd',
    data: { breadcrumb: 'Cost Master TRD' },
    children: [
      {
        path: 'list',
        component: CostmastertrdListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'list/view',
        component: CostmastertrdListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'logs',
        component: CostmastertrdHistoryComponent,
        data: { breadcrumb: 'Logs' }
      },
      {
        path: 'downloads',
        component: CostmastertrdDownloadsComponent,
        data: { breadcrumb: 'Downloads' }
      }
    ]
  },
  {
    path: 'additionalcharges',
    data: { breadcrumb: 'Additional Charges' },
    children: [
      {
        path: 'list',
        component: AdditionalchargesListComponent,
        data: { breadcrumb: 'List' }
      }
    ]
  },
  {
    path: 'priceconfigurationalp',
    data: { breadcrumb: 'Price Configuration (ALP)' },
    children: [
      {
        path: 'add',
        component: PriceconfigurationAlpComponent,
        data: { breadcrumb: 'Add' }
      }
    ]
  },

  {
    path: 'moq',
    data: { breadcrumb: 'Manage MOQ/MDQ' },
    children: [
      {
        path: 'list',
        component: MoqComponent,
        data: { breadcrumb: '' }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule {

}