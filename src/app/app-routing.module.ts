import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { SellerGuardService } from './sellerGuard/seller-guard.service';
import { HomeComponent } from './home/home/home.component';
import { SellerDataFormComponent } from './register/seller-data-form/seller-data-form.component';
import { RegisterCompletedComponent } from './register/register-completed/register-completed.component';
import { SellerHomeComponent } from './seller-panel/seller-home/seller-home.component';
import { ProductUploadComponent } from './seller-panel/seller-product/product-upload/product-upload.component';
import { CategorySelectionComponent } from './seller-panel/seller-product/category-selection/category-selection.component';
import { ProductFilesComponent } from './seller-panel/seller-product/product-files/product-files.component';
import { ProductOverviewComponent } from './seller-panel/product-overview/product-overview.component';
import { ProductVariantsComponent } from './seller-panel/seller-product/product-variants/product-variants.component';
import { ProductVariantFilesComponent } from './seller-panel/seller-product/product-variant-files/product-variant-files.component';
import { ProductInventoryComponent } from './seller-panel/product-inventory-manager/product-inventory/product-inventory.component';
import { ModifiledProductFilesComponent } from './seller-panel/product-files/modifiled-product-files/modifiled-product-files.component';
import { OrdersComponent } from './seller-panel/orders/orders/orders.component';

const routes: Routes = [
{ path: 'register', component: RegisterComponent },
{ path: '', component:HomeComponent },
{ path: 'login', component: LoginComponent },
{ path: 'register/seller-information', component: SellerDataFormComponent },
{ path: 'register/register-completed', component: RegisterCompletedComponent },

{
  path: 'seller/dashboard',canActivate:[SellerGuardService] ,
      children: [
                  //ADMIN PANEL
                    { path: '', component: SellerHomeComponent },
                    { path: 'categorySelection/single-category', component: CategorySelectionComponent },
                    { path: 'productUpload', component: ProductUploadComponent },
                    { path: 'productFiles', component: ProductFilesComponent },
                    { path: 'product-Overview', component: ProductOverviewComponent },
                    { path: 'product-Variant', component: ProductVariantsComponent },
                    { path: 'productVariantFiles', component: ProductVariantFilesComponent },
                    { path: 'product-inventory', component: ProductInventoryComponent },
                    { path: 'modified-product-files', component: ModifiledProductFilesComponent },
                    { path: 'orders', component: OrdersComponent },

      ],
}
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'top', // har route change par top scroll
  anchorScrolling: 'enabled',       // agar #id use ho to scroll kare
  scrollOffset: [0, 0]              // optional, top se offset
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
