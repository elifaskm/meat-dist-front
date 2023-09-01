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

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'inputs_outputs',      component: InputsOutputsComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'register-input',      component: RegisterInputComponent },
    { path: 'register-output',      component: RegisterOutputComponent },
    { path: 'reportes',      component: ReportesComponent },
    { path: 'totals-by-product',      component: TotalsByProductComponent },
    { path: 'totals-by-date',      component: TotalsByDateComponent }
];
