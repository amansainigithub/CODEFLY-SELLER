import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxSpinnerModule } from "ngx-spinner";
import { HomeComponent } from './home/home/home.component';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { NgToastModule } from 'ng-angular-popup';
import { SellerDataFormComponent } from './register/seller-data-form/seller-data-form.component';
import {MatStepperModule} from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import { RegisterCompletedComponent } from './register/register-completed/register-completed.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import { SellerHomeComponent } from './seller-panel/seller-home/seller-home.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NgChartsModule } from 'ng2-charts';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatBadgeModule} from '@angular/material/badge';
import { MatDialogModule} from '@angular/material/dialog';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProductUploadComponent } from './seller-panel/seller-product/product-upload/product-upload.component';
import { CategorySelectionComponent } from './seller-panel/seller-product/category-selection/category-selection.component';
import { ModelStructureComponent } from './seller-panel/seller-product/model-structure/model-structure.component';
import { ProductFilesComponent } from './seller-panel/seller-product/product-files/product-files.component';
import { ProductOverviewComponent } from './seller-panel/product-overview/product-overview.component';
import { ProductVariantsComponent } from './seller-panel/seller-product/product-variants/product-variants.component';
import { ProductVariantFilesComponent } from './seller-panel/seller-product/product-variant-files/product-variant-files.component';
import { ProductInventoryComponent } from './seller-panel/product-inventory-manager/product-inventory/product-inventory.component';
import { ModifiledProductFilesComponent } from './seller-panel/product-files/modifiled-product-files/modifiled-product-files.component';
import { OrdersComponent } from './seller-panel/orders/orders/orders.component';
import { Register2Component } from './register2/register2/register2.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    SellerDataFormComponent,
    RegisterCompletedComponent,
    SellerHomeComponent,
    ProductUploadComponent,
    CategorySelectionComponent,
    ModelStructureComponent,
    ProductFilesComponent,
    ProductOverviewComponent,
    ProductVariantsComponent,
    ProductVariantFilesComponent,
    ProductInventoryComponent,
    ModifiledProductFilesComponent,
    OrdersComponent,
    Register2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatSidenavModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    NgToastModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatCardModule,
    MatTabsModule,
    MatPaginatorModule,
    NgChartsModule,
    MatTooltipModule,
    MatSelectModule,
    MatBadgeModule,
    MatDialogModule,
    MatAutocompleteModule,
    NgxSkeletonLoaderModule.forRoot({ animation: 'pulse', loadingText: 'This item is actually loading...' })
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [authInterceptorProviders,provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
