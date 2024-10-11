import { UpdateProductSentComponent } from './../../pages/product_sents/update-product-sent/update-product-sent.component';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
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
import { KgByBoxesComponent } from '../../pages/inputs_outputs/kg-by-boxes/kg-by-boxes.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BranchCashControlComponent } from '../../pages/branch-cash-control/branch-cash-control.component';
import { ProductSentsComponent } from '../../pages/product_sents/product_sents.component';
import { ResidueOfBranchComponent } from '../../pages/reportes/residue-of-branch/residue-of-branch.component';
import { BranchesComponent } from '../../pages/catalogs/branches/branches.component';
import { UpdateBranchesComponent } from './../../pages/catalogs/branches/update-branches/update-branches.component';
import { CatalogsComponent } from '../../pages/catalogs/catalogs.component';
import { InsertBranchesComponent } from './../../pages/catalogs/branches/insert-branches/insert-branches.component';
import { UpdateProductsComponent } from './../../pages/catalogs/products/update-products/update-products.component';
import { InsertProductsComponent } from './../../pages/catalogs/products/insert-products/insert-products.component';
import { ProductsComponent } from '../../pages/catalogs/products/products.component';
import { ConfigurationComponent } from '../../pages/configuration/configuration.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    InputsOutputsComponent,
    RegisterInputComponent,
    RegisterOutputComponent,
    ReportesComponent,
    TotalsByProductComponent,
    TotalsByDateComponent,
    RestartDbComponent,
    KgByBoxesComponent,
    BranchCashControlComponent,
    ProductSentsComponent,
    UpdateProductSentComponent,
    ResidueOfBranchComponent,
    BranchesComponent,
    UpdateBranchesComponent,
    CatalogsComponent,
    InsertBranchesComponent,
    UpdateProductsComponent,
    InsertProductsComponent,
    ProductsComponent,
    ConfigurationComponent
  ]
})

export class AdminLayoutModule {}
