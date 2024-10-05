import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { RouterGuardService } from '../services/router-guard/router-guard.service';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ManagerOrderComponent } from './manage-order/manager-order/manager-order.component';

export const MaterialRoutes: Routes = [
  {
    path: 'category',
    component: ManageCategoryComponent,
    canActivate: [RouterGuardService],
    data: {
      expectedRole: ['admin']
    },
  },
  {
    path: 'product',
    component: ManageProductComponent,
    canActivate: [RouterGuardService],
    data: {
      expectedRole: ['admin']
    }
  },
  {
    path: 'order',
    component: ManagerOrderComponent,
    canActivate: [RouterGuardService],
    data: {
      expectedRole: ['admin', 'user']
    }
  }
];
