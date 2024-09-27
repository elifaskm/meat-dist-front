import { ProductSentsComponent } from './../../pages/product_sents/product_sents.component';
import { ProductSent } from './../../models/product_sent.model';
import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { InputsOutputsComponent } from '../../pages/inputs_outputs/inputs_outputs.component';
import { RegisterInputComponent } from '../../pages/inputs_outputs/register-input/register-input.component';
import { RegisterOutputComponent } from '../../pages/inputs_outputs/register-output/register-output.component';
import { ReportesComponent } from '../../pages/reportes/reportes.component';
import { TotalsByProductComponent } from '../../pages/reportes/totals-by-product/totals-by-product.component';
import { TotalsByDateComponent } from '../../pages/reportes/totals-by-date/totals-by-date.component';
import { RestartDbComponent } from '../../pages/restart-db/restart-db.component';
import { BranchCashControlComponent } from '../../pages/branch-cash-control/branch-cash-control.component';
import { isAuthenticatedGuard } from 'src/app/guards';
import { UpdateProductSentComponent } from '../../pages/product_sents/update-product-sent/update-product-sent.component';
import { ResidueOfBranchComponent } from '../../pages/reportes/residue-of-branch/residue-of-branch.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', canActivate: [isAuthenticatedGuard],      component: DashboardComponent },
    { path: 'inputs_outputs', canActivate: [isAuthenticatedGuard],      component: InputsOutputsComponent },
    { path: 'product_sent', canActivate: [isAuthenticatedGuard],      component: ProductSentsComponent },
    { path: 'branch-cash-control', canActivate: [isAuthenticatedGuard],      component: BranchCashControlComponent },
    { path: 'user-profile', canActivate: [isAuthenticatedGuard],   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'register-input', canActivate: [isAuthenticatedGuard],      component: RegisterInputComponent },
    { path: 'register-output', canActivate: [isAuthenticatedGuard],      component: RegisterOutputComponent },
    { path: 'reportes', canActivate: [isAuthenticatedGuard],      component: ReportesComponent },
    { path: 'totals-by-product', canActivate: [isAuthenticatedGuard],      component: TotalsByProductComponent },
    { path: 'totals-by-date', canActivate: [isAuthenticatedGuard],      component: TotalsByDateComponent },
    { path: 'restart-db', canActivate: [isAuthenticatedGuard],      component: RestartDbComponent },
    { path: 'update-product-sent', canActivate: [isAuthenticatedGuard],      component: UpdateProductSentComponent },
    { path: 'residue-of-branch', canActivate: [isAuthenticatedGuard],      component: ResidueOfBranchComponent },
];
