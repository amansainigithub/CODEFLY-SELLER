import { Component } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductOverviewService } from '../../_services/productOverviewService/product-overview.service';
import { PageEvent } from '@angular/material/paginator';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-product-overview',
  templateUrl: './product-overview.component.html',
  styleUrl: './product-overview.component.css',
})
export class ProductOverviewComponent {
  isChecked = true;
  underReviewData: any;


  totalElements: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;

  // is Skeleton Loader Valid
  isLoaderValid:any =false;;



  constructor(
    private productOverviewService: ProductOverviewService,
    private spinner: NgxSpinnerService,
    private toast: NgToastService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {}

  // UNDER REVIEW PRODUCT STARTING
  getProductUnderReview() {
    this.getUnderReviewProduct({ page: "0", size: "10" });
  }

  getUnderReviewProduct(request: any) {
    this.isLoaderValid = true;

    const user = this.tokenStorageService.getUser();

    this.productOverviewService
      .getUnderReviewProduct(request, user.username)
      .subscribe({
        next: (res: any) => {
          this.underReviewData = res.data.content;
          this.totalElements = res.data.totalElements;
          this.currentPage = res.data.pageable.pageNumber;
          this.itemsPerPage = res.data.pageable.pageSize;
          this.isLoaderValid = false;

          this.toast.success({
            detail: 'Success',
            summary: 'Data Fetch Success',
            position: 'bottomRight',
            duration: 3000,
          });
        },
        error: (err: any) => {
          this.isLoaderValid = false;
          this.toast.error({
            detail: 'Error',
            summary: err.error.data?.message || 'Something went wrong',
            position: 'bottomRight',
            duration: 3000,
          });
        },
      });
}


nextPage(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;

    const request = {
        page: this.currentPage.toString(),
        size: this.itemsPerPage.toString()
    };

    this.getUnderReviewProduct(request);
}

   // UNDER REVIEW PRODUCT ENDING
}
