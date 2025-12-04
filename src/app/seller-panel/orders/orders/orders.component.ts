import { Component } from '@angular/core';
import { OrdersService } from '../../../_services/orders/orderService/orders.service';
import { NgToastService } from 'ng-angular-popup';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  // ACTIVE ORDERS
  activeOrders: any[] = [];
  activeOrders_totalElements: number = 0;
  activeOrders_currentPage: number = 1;
  activeOrders_itemsPerPage: number = 10;

  constructor(
    private orderService: OrdersService,
    private toast: NgToastService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.getActiveOrders();
  }

  getActiveOrders() {
    this.getActiveOrdersByService({ page: '0', size: '10' });
  }

  getActiveOrdersByService(request: any) {
    const user = this.tokenStorageService.getUser();

    this.orderService.getOrders(request, user.username).subscribe({
      next: (res: any) => {
        console.log(res);
        this.activeOrders = res.data.content;

        //  PAGENATION DATA
        this.activeOrders_totalElements = res.data.totalElements;
        this.activeOrders_currentPage = res.data.pageable.pageNumber;
        this.activeOrders_itemsPerPage = res.data.pageable.pageSize;
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


nextPageActiveProducts(event: PageEvent) {
      this.activeOrders_currentPage = event.pageIndex;
      this.activeOrders_itemsPerPage = event.pageSize;
      const request = {
        page: this.activeOrders_currentPage.toString(),
        size: this.activeOrders_itemsPerPage.toString(),
      };
      this.getActiveOrdersByService(request);
}

selectAll(event: any) {
  const checked = event.target.checked;
  this.activeOrders.forEach((order: any) => order.selected = checked);
  console.log(this.getSelectedOrders());
}

getSelectedOrders() {
  return this.activeOrders.filter((o: any) => o.selected);
}

selectAllChecked: boolean = false;
onSingleSelectChange() {
  this.selectAllChecked = this.activeOrders.every((order: any) => order.selected);
  console.log("Selected Orders:", this.getSelectedOrders());
}

acceptOrder(order: any) {
  console.log("Accepted order:", order);
  // Add API call or status update logic here
}

rejectOrder(order: any) {
  console.log("Rejected order:", order);
  // Add API call or status update logic here
}


































  getPendingOrders() {
    console.log('Pending Orders Fetching...');
    // TODO: API call karo and pendingOrders me push karo
  }

  getCancelledOrders() {
    console.log('Cancelled Orders Fetching...');
    // TODO: API call karo and cancelledOrders me push karo
  }
}
