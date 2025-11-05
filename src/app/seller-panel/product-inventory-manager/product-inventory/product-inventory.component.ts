import { Component } from '@angular/core';
import { ProductInventoryService } from '../../../_services/productInventoryServices/productInventoryService/product-inventory.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgToastService } from 'ng-angular-popup';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-product-inventory',
  templateUrl: './product-inventory.component.html',
  styleUrl: './product-inventory.component.css'
})
export class ProductInventoryComponent {

  
 //  ALL STOCKS PRODUCT STARTING
  AllStockData: any;
  totalElements: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  // is Skeleton Loader Valid
  userAllProduct_skeleton: any = false;

     constructor(
       private productStockService: ProductInventoryService,
       private toast: NgToastService,
       private tokenStorageService: TokenStorageService,
     ) {}

  ngOnInit(): void {
     this.getAllStocks()
  }


  getAllStocks() {
    this.fetchAllStocksProducts({ page: '0', size: '10' });
  }

  
  fetchAllStocksProducts(request: any) {
    this.userAllProduct_skeleton = true;

    const user = this.tokenStorageService.getUser();

    this.productStockService.getAllInventoryProducts(request, user.username)
      .subscribe({
        next: (res: any) => {
          this.AllStockData = res.data.content;
          console.log(this.AllStockData);
          
          this.totalElements = res.data.totalElements;
          this.currentPage = res.data.pageable.pageNumber;
          this.itemsPerPage = res.data.pageable.pageSize;
          this.userAllProduct_skeleton = false;      
        },
        error: (err: any) => {
          this.userAllProduct_skeleton = false;
          this.toast.error({
            detail: 'Error',
            summary: err.error.data?.message || 'Something went wrong',
            position: 'topRight',
            duration: 2000,
          });
        },
      });
  }

  

    nextPageStockProducts(event: PageEvent) {
      this.currentPage = event.pageIndex;
      this.itemsPerPage = event.pageSize;
      const request = {
        page: this.currentPage.toString(),
        size: this.itemsPerPage.toString(),
      };
      this.fetchAllStocksProducts(request);
    }



//VALIDATE INVENTORY    
allowOnlyNumber(event: KeyboardEvent) {
  const char = event.key;
  if (!/^[0-9]$/.test(char)) {
    event.preventDefault();
    return;
  }
}

onInventoryInput(inventories: any) {
  let val = inventories.inventory;

  // Non-numeric characters hatao
  val = val.replace(/[^0-9]/g, '');

  // Max limit apply → greater than 10000 not allowed
  if (Number(val) > 10000) {
    val = '10000';
  }

  inventories.inventory = val;
}
//VALIDATE INVENTORY 


//Update Product Inventory Starting
updateProductInventory={
  id:'',
  inventory:'',
  username:'',
  productSize:''
}    

updateInventory(productSize:any, invId: number, newQty: number) {
  console.log("✅ Update Called =>", invId, newQty);
  
  //Get Username
  const user = this.tokenStorageService.getUser();

  this.updateProductInventory.id = invId.toString();
  this.updateProductInventory.inventory = newQty.toString();
  this.updateProductInventory.username = user.username;
  this.updateProductInventory.productSize = productSize;


  this.productStockService.updateProductInventory(this.updateProductInventory)
      .subscribe({
        next: (res: any) => { 
          this.toast.success({ detail: 'Success', summary: 'Inventory Update Success.',position: 'topRight', duration: 2000,});
          this.getAllStocks();
        },
        error: (err: any) => {
          this.userAllProduct_skeleton = false;
          this.toast.error({ detail: 'Error',summary: 'Error | Inventory Not Update',position: 'topRight',duration: 2000,});
        },
  });
}
//Update Product Inventory Ending

// =============================================================================================================
// =============================================================================================================
// OUT OF STOCKS PRODUCTS STARTING

    // USER ALL PRODUCT STARTING
  outOfStock_stockData: any;
  outOfStock_totalElements: number = 0;
  outOfStock_currentPage: number = 1;
  outOfStock_itemsPerPage: number = 10;
  // is Skeleton Loader Valid
  outOfStock_skeleton: any = false;

getOutOfStocks(){
  this.getAoutOfStocksProducts({ page: '0', size: '10' });
}


getAoutOfStocksProducts(request: any) {
    this.userAllProduct_skeleton = true;

    const user = this.tokenStorageService.getUser();

    this.productStockService.getOutOfStocksProducts(request, user.username)
      .subscribe({
        next: (res: any) => {
          this.outOfStock_stockData = res.data.content;   
          this.outOfStock_totalElements = res.data.totalElements;
          this.outOfStock_currentPage = res.data.pageable.pageNumber;
          this.outOfStock_itemsPerPage = res.data.pageable.pageSize;
          this.outOfStock_skeleton = false;      
        },
        error: (err: any) => {
          this.outOfStock_skeleton = false;
          this.toast.error({
            detail: 'Error',
            summary: err.error.data?.message || 'Something went wrong',
            position: 'topRight',
            duration: 2000,
          });
        },
      });
  }

  
    nextPageOutOfStockProducts(event: PageEvent) {
      this.outOfStock_currentPage = event.pageIndex;
      this.outOfStock_itemsPerPage = event.pageSize;
      const request = {
        page: this.outOfStock_currentPage.toString(),
        size: this.outOfStock_itemsPerPage.toString(),
      };
      this.getAoutOfStocksProducts(request);
    }

// OUT OF STOCKS PRODUCTS ENDING
// =============================================================================================================
// =============================================================================================================

// LOW STOCKS PRODUCTS STARTING

    // USER ALL PRODUCT STARTING
  lowStock_stockData: any;
  lowStock_totalElements: number = 0;
  lowStock_currentPage: number = 1;
  lowStock_itemsPerPage: number = 10;
  // is Skeleton Loader Valid
  lowStock_skeleton: any = false;

getLowStocks(){
  this.getLowStocksProducts({ page: '0', size: '10' });
}


getLowStocksProducts(request: any) {
    this.lowStock_skeleton = true;

    const user = this.tokenStorageService.getUser();

    this.productStockService.getLowStocksProducts(request, user.username)
      .subscribe({
        next: (res: any) => {
          this.lowStock_stockData = res.data.content;
          this.lowStock_totalElements = res.data.totalElements;
          this.lowStock_currentPage = res.data.pageable.pageNumber;
          this.lowStock_itemsPerPage = res.data.pageable.pageSize;
          this.lowStock_skeleton = false;      
        },
        error: (err: any) => {
          this.lowStock_skeleton = false;
          this.toast.error({
            detail: 'Error',
            summary: err.error.data?.message || 'Something went wrong',
            position: 'topRight',
            duration: 2000,
          });
        },
      });
  }
  
    nextPageLowStockProducts(event: PageEvent) {
      this.lowStock_currentPage = event.pageIndex;
      this.lowStock_itemsPerPage = event.pageSize;
      const request = {
        page: this.lowStock_currentPage.toString(),
        size: this.lowStock_itemsPerPage.toString(),
      };
      this.getLowStocksProducts(request);
    }

// =============================================================================================================
// ==================

}
