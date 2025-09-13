import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProductCategoryService } from '../../../_services/productCategory/product-category.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedDataService } from '../../../_services/sharedService/shared-data.service';
import { Router } from '@angular/router';


declare var bootstrap: any; // Declare bootstrap for accessing modal methods
@Component({
  selector: 'app-category-selection',
  templateUrl: './category-selection.component.html',
  styleUrl: './category-selection.component.css'
})
export class CategorySelectionComponent {

  rootCategories: any;
  subCategories: any;
  typeCategories: any;
  variantCategories: any;

  //SAVE AND CONTINUE BUTTON
  scButton:any =true;

  constructor(
    private pcService: ProductCategoryService,
    private spinner: NgxSpinnerService,
    private sharedService:SharedDataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.pcService.getRootCategory()
      .subscribe({
        next: (res: any) => {
          this.rootCategories = res.data;
          this.spinner.hide();
        },
        error: (err: any) => {
          console.log(err);
          this.spinner.hide();
        }
      });
  }

  // Active states
  rootCategory: string | null = null;
  subCategory: any = null;
  typeCategory: any = null;
  variantCategory: any = null;

  // Root selection
  setRootCategory(item: string, id: any) {
    
    this.rootCategory = item;
    this.subCategory = null;
    this.typeCategory = null;
    this.variantCategory = null;
    this.finalCategoryBoxHide();

    this.getSubCategory(id);

    //MAKE BLANK (RESET DATA)
    this.typeCategories = null;
    this.variantCategories = null;
  }

  getSubCategory(id: any) {
    this.spinner.show();
    this.pcService.getSubCategory(id)
      .subscribe({
        next: (res: any) => {
          this.subCategories = res.data;
          this.spinner.hide();
        },
        error: (err: any) => {
          console.log(err);
          this.spinner.hide();
        }
      });
  }

  // SubCategory selection → fetch Type
  setActiveSubCategory(sub: any) {
    this.subCategory = sub;
    this.typeCategory = null;
    this.variantCategory = null;
    this.finalCategoryBoxHide();

    this.getTypeCategory(sub.id);

    //MAKE BLANK (RESET DATA)
     this.variantCategories = null;
  }

  getTypeCategory(id: any) {
    this.spinner.show();
    this.pcService.getTypeCategory(id)
      .subscribe({
        next: (res: any) => {
          this.typeCategories = res.data;
          this.spinner.hide();
        },
        error: (err: any) => {
          console.log(err);
          this.spinner.hide();
        }
      });
  }

  // Type selection → fetch Variant
  setActiveTypeCategory(type: any) {
    this.typeCategory = type;
    this.variantCategory = null;
    this.finalCategoryBoxHide();

    this.getVariantCategory(type.id);
  }

  getVariantCategory(id: any) {
    this.spinner.show();
    this.pcService.getVariantCategory(id)
      .subscribe({
        next: (res: any) => {
          this.variantCategories = res.data;
          this.spinner.hide();
        },
        error: (err: any) => {
          console.log(err);
          this.spinner.hide();
        }
      });
  }

  // Variant selection → Final
  setActiveVariantCategory(variant: any) {
    this.variantCategory = variant;
    this.finalCategoryBoxShow();

    //SAVE AND CONTINUE BUTTON
    this.scButton =false;
  }

  // Final box show/hide
  finalCategory: any = false;
  finalCategoryBoxShow() {
    this.finalCategory = true;
  }
  finalCategoryBoxHide() {
    this.finalCategory = false;
  }




  proceedWithProduct(){
    this.spinner.show();
    console.log(this.variantCategory);
    if (this.variantCategory && this.variantCategory.id !== null 
        && this.variantCategory.id !== undefined && this.variantCategory.id !== "") {
       //close model
         this.closeModal();

       //Set Catalog Id to shared Service 
         this.sharedService.setData({vData:this.variantCategory});
         this.router.navigate(['/seller/dashboard/home/productUpload']);
         this.spinner.hide();

    } else {
      this.spinner.show();
      console.log("Invalid object (id null/blank/empty)");
      alert("Invalid object (id null/blank/empty)")
    }



    
  }





// ======================================================================================
      //Open Mode Starting
    openModal(): void {
      const modalElement = document.getElementById('categorySelectionModel');
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Show the modal programmatically
    }
    //Open Model Ending
  
     // Close model Starting
     closeModal(): void {
      const modalElement = document.getElementById('categorySelectionModel');
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide(); // Hide the modal programmatically
    }
    //Close Model Ending
}
