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

  
    // USER ALL PRODUCT STARTING
  AllStockData: any;
  totalElements: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  // is Skeleton Loader Valid
  userAllProduct_skeleton: any = false;

     constructor(
       private productStockService: ProductInventoryService,
       private spinner: NgxSpinnerService,
       private toast: NgToastService,
       private tokenStorageService: TokenStorageService,
       private router: Router
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
            position: 'bottomRight',
            duration: 3000,
          });
        },
      });
  }

  

    nextPageUserAllProduct(event: PageEvent) {
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


}
