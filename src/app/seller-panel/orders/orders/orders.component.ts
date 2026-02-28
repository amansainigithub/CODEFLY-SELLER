import { Component, ElementRef, ViewChild } from '@angular/core';
import { OrdersService } from '../../../_services/orders/orderService/orders.service';
import { NgToastService } from 'ng-angular-popup';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { PageEvent } from '@angular/material/paginator';
declare var bootstrap: any; // Declare bootstrap for accessing modal methods

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {

    constructor(
    private orderService: OrdersService,
    private toast: NgToastService,
    private tokenStorageService: TokenStorageService
  ) {}

  
 onTabChange(event: any) {
  if (event.index === 0) {
    this.getPendingOrders();
  } else if (event.index === 1) {
    this.getConfirmedOrders();
  }else if (event.index === 2) {
    this.getShippedOrders();
  }else if (event.index === 3) {
    this.getdeliverdOrders();
  }else if (event.index === 4) {
    this.cancelOrders();
  }
}


// ###############################################################################
// ##############################################################################
// PENDING ORDER STARTING
  pendingOrders: any[] = [];
  pendingOrders_totalElements: number = 0;
  pendingOrders_currentPage: number = 1;
  pendingOrders_itemsPerPage: number = 10;

  ngOnInit(): void {
    this.getPendingOrders();
  }

  getPendingOrders() {
    this.getPendingOrdersData({ page: '0', size: '10' });
  }

  getPendingOrdersData(request: any) {
    const user = this.tokenStorageService.getUser();

    this.orderService.getPendingOrders(request, user.username).subscribe({
      next: (res: any) => {
        console.log(res);
        this.pendingOrders = res.data.content;

        //  PAGENATION DATA
        this.pendingOrders_totalElements = res.data.totalElements;
        this.pendingOrders_currentPage = res.data.pageable.pageNumber;
        this.pendingOrders_itemsPerPage = res.data.pageable.pageSize;
      },
      error: (err: any) => {
        this.toast.error({
          detail: 'Error',
          summary: err.error.data?.message || 'Something went wrong',
          position: 'topRight',
          duration: 2000,
        });
      },
    });

  }


nextPagePendingProducts(event: PageEvent) {
      this.pendingOrders_currentPage = event.pageIndex;
      this.pendingOrders_itemsPerPage = event.pageSize;
      const request = {
        page: this.pendingOrders_currentPage.toString(),
        size: this.pendingOrders_itemsPerPage.toString(),
      };
      this.getPendingOrdersData(request);
}

selectAll(event: any) {
  const checked = event.target.checked;
  this.pendingOrders.forEach((order: any) => order.selected = checked);
  console.log(this.getSelectedOrders());
}

getSelectedOrders() {
  return this.pendingOrders.filter((o: any) => o.selected);
}

selectAllChecked: boolean = false;
onSingleSelectChange() {
  this.selectAllChecked = this.pendingOrders.every((order: any) => order.selected);
  console.log("Selected Orders:", this.getSelectedOrders());
}


acceptOrderData:any;
acceptOrder(order: any) {
  console.log("Accepted order:", order);
  this.acceptOrderData = order;
  this.modelShow();
}

rejectOrder(order: any) {
  console.log("Rejected order:", order);
  // Add API call or status update logic here
}

orderDetails:any ={
  productName: '',
  orderNoPerItem: '',
  userId: '',
  username: '',
  id: ''
}

isLoading: boolean = false;
progressValue: number = 0;


acceptOrderFinal() {

  const user = this.tokenStorageService.getUser();

  this.orderDetails.id = this.acceptOrderData.id;
  this.orderDetails.userId = this.acceptOrderData.userId;
  this.orderDetails.orderNoPerItem = this.acceptOrderData.orderNoPerItem;
  this.orderDetails.productName = this.acceptOrderData.productName;
  this.orderDetails.username = user.username;

  this.isLoading = true;
  this.progressValue = 0;

  // 3 seconds progress animation
  const interval = setInterval(() => {
    if (this.progressValue < 100) {
      this.progressValue += 10;
    }
  }, 300);

  this.orderService.orderAcceptService(this.orderDetails).subscribe({
    next: (res: any) => {

      setTimeout(() => {
        clearInterval(interval);
        this.modelClose();
        this.isLoading = false;
        //get pending Order Again
        this.getPendingOrders();
      }, 3000); 
    },
    error: (err: any) => {
      clearInterval(interval);
      this.isLoading = false;
      console.error(err);
      alert("Order Failed ❌");

      this.modelClose();
      this.isLoading = false;
    },
  });

}




// MODEL PROPERTIES STARTING
// =============================================================================
// =============================================================================
    // MODEL PROPERTIES STARTING
    @ViewChild('pendingOrderModel') variantModel!: ElementRef;
    modelShow() {
      const modal = new bootstrap.Modal(this.variantModel.nativeElement);
      modal.show();
    }
    modelClose() {
      const modal = bootstrap.Modal.getInstance(this.variantModel.nativeElement);
      modal?.hide();
    }
   // MODEL PROPERTIES ENDING
// =============================================================================
// =============================================================================



// PENDING ORDER ENDING
// #######################################################################################################
// #######################################################################################################






























// CONFIRMED ORDER STARTING
// #######################################################################################################
// #######################################################################################################

  getConfirmedOrders() {
    this.getConfirmedOrdersData({ page: '0', size: '10' });
  }

  confirmedOrders: any[] = [];
  confirmedOrders_totalElements: number = 0;
  confirmedOrders_currentPage: number = 1;
  confirmedOrders_itemsPerPage: number = 10;
  

  getConfirmedOrdersData(request: any) {
    const user = this.tokenStorageService.getUser();

    this.orderService.getConfirmedOrders(request, user.username).subscribe({
      next: (res: any) => {
        console.log(res);
        this.confirmedOrders = res.data.content;

        //  PAGENATION DATA
        this.confirmedOrders_totalElements = res.data.totalElements;
        this.confirmedOrders_currentPage = res.data.pageable.pageNumber;
        this.confirmedOrders_itemsPerPage = res.data.pageable.pageSize;
      },
      error: (err: any) => {
        this.toast.error({
          detail: 'Error',
          summary: err.error.data?.message || 'Something went wrong',
          position: 'topRight',
          duration: 2000,
        });
      },
    });

  }


nextPageConfirmedProducts(event: PageEvent) {
      this.confirmedOrders_currentPage = event.pageIndex;
      this.confirmedOrders_itemsPerPage = event.pageSize;
      const request = {
        page: this.confirmedOrders_currentPage.toString(),
        size: this.confirmedOrders_itemsPerPage.toString(),
      };
      this.getConfirmedOrdersData(request);
}



// #######################################################################################################
// #######################################################################################################
// CONFIRMED ORDER ENDING

































// SHIPPED ORDER STARTING
// #######################################################################################################
// #######################################################################################################

  getShippedOrders() {
    this.getShippedOrdersData({ page: '0', size: '10' });
  }

  shippedOrders: any[] = [];
  shippedOrders_totalElements: number = 0;
  shippedOrders_currentPage: number = 1;
  shippedOrders_itemsPerPage: number = 10;
  

  getShippedOrdersData(request: any) {
    const user = this.tokenStorageService.getUser();

    this.orderService.getShippedOrders(request, user.username).subscribe({
      next: (res: any) => {
        console.log(res);
        this.shippedOrders = res.data.content;

        //  PAGENATION DATA
        this.shippedOrders_totalElements = res.data.totalElements;
        this.shippedOrders_currentPage = res.data.pageable.pageNumber;
        this.shippedOrders_itemsPerPage = res.data.pageable.pageSize;
      },
      error: (err: any) => {
        this.toast.error({
          detail: 'Error',
          summary: err.error.data?.message || 'Something went wrong',
          position: 'topRight',
          duration: 2000,
        });
      },
    });

  }


nextPageShippedProducts(event: PageEvent) {
      this.shippedOrders_currentPage = event.pageIndex;
      this.shippedOrders_itemsPerPage = event.pageSize;
      const request = {
        page: this.shippedOrders_currentPage.toString(),
        size: this.shippedOrders_itemsPerPage.toString(),
      };
      this.getShippedOrdersData(request);
}



// #######################################################################################################
// #######################################################################################################
// SHIPPED ORDER ENDING










































// SHIPPED ORDER STARTING
// #######################################################################################################
// #######################################################################################################

  getdeliverdOrders() {
    this.getdeliverdOrdersData({ page: '0', size: '10' });
  }

  deliveredOrders: any[] = [];
  deliveredOrders_totalElements: number = 0;
  deliveredOrders_currentPage: number = 1;
  deliveredOrders_itemsPerPage: number = 10;
  

  getdeliverdOrdersData(request: any) {
    const user = this.tokenStorageService.getUser();

    this.orderService.getdeliveredOrders(request, user.username).subscribe({
      next: (res: any) => {
        console.log(res);
        this.deliveredOrders = res.data.content;

        //  PAGENATION DATA
        this.deliveredOrders_totalElements = res.data.totalElements;
        this.deliveredOrders_currentPage = res.data.pageable.pageNumber;
        this.deliveredOrders_itemsPerPage = res.data.pageable.pageSize;
      },
      error: (err: any) => {
        this.toast.error({
          detail: 'Error',
          summary: err.error.data?.message || 'Something went wrong',
          position: 'topRight',
          duration: 2000,
        });
      },
    });

  }


nextPageDeliveredProducts(event: PageEvent) {
      this.deliveredOrders_currentPage = event.pageIndex;
      this.deliveredOrders_itemsPerPage = event.pageSize;
      const request = {
        page: this.deliveredOrders_currentPage.toString(),
        size: this.deliveredOrders_itemsPerPage.toString(),
      };
      this.getdeliverdOrdersData(request);
}



// #######################################################################################################
// #######################################################################################################
// SHIPPED ORDER ENDING







































// SHIPPED ORDER STARTING
// #######################################################################################################
// #######################################################################################################

  cancelOrders() {
    this.getCancelledOrdersData({ page: '0', size: '10' });
  }

  cancelledOrders: any[] = [];
  cancelledOrders_totalElements: number = 0;
  cancelledOrders_currentPage: number = 1;
  cancelledOrders_itemsPerPage: number = 10;
  

  getCancelledOrdersData(request: any) {
    const user = this.tokenStorageService.getUser();

    this.orderService.getCancelledOrders(request, user.username).subscribe({
      next: (res: any) => {
        console.log(res);
        this.cancelledOrders = res.data.content;

        //  PAGENATION DATA
        this.cancelledOrders_totalElements = res.data.totalElements;
        this.cancelledOrders_currentPage = res.data.pageable.pageNumber;
        this.cancelledOrders_itemsPerPage = res.data.pageable.pageSize;
      },
      error: (err: any) => {
        this.toast.error({
          detail: 'Error',
          summary: err.error.data?.message || 'Something went wrong',
          position: 'topRight',
          duration: 2000,
        });
      },
    });

  }


nextPageCancelledProducts(event: PageEvent) {
      this.cancelledOrders_currentPage = event.pageIndex;
      this.cancelledOrders_itemsPerPage = event.pageSize;
      const request = {
        page: this.cancelledOrders_currentPage.toString(),
        size: this.cancelledOrders_itemsPerPage.toString(),
      };
      this.getCancelledOrdersData(request);
}



// #######################################################################################################
// #######################################################################################################
// SHIPPED ORDER ENDING


}