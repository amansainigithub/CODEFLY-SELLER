import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { SellerGuardService } from './sellerGuard/seller-guard.service';
import { HomeComponent } from './home/home/home.component';
import { SellerDataFormComponent } from './register/seller-data-form/seller-data-form.component';
import { RegisterCompletedComponent } from './register/register-completed/register-completed.component';
import { SellerHomeComponent } from './seller-panel/seller-home/seller-home.component';
import { ProductUploadComponent } from './seller-panel/seller-product/product-upload/product-upload.component';
import { CategorySelectionComponent } from './seller-panel/seller-product/category-selection/category-selection.component';

const routes: Routes = [
{ path: 'register', component: RegisterComponent },
{ path: '', component:HomeComponent },
{ path: 'login', component: LoginComponent },
{ path: 'register/seller-information', component: SellerDataFormComponent },
{ path: 'register/register-completed', component: RegisterCompletedComponent },

{
  path: 'seller/dashboard/home',canActivate:[SellerGuardService] ,
      children: [
                  //ADMIN PANEL
                    { path: '', component: SellerHomeComponent },
                    { path: 'productUpload', component: ProductUploadComponent },
                    { path: 'categorySelection/single-category', component: CategorySelectionComponent },
                  
      ],
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
