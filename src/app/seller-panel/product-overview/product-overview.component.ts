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

  constructor(
    private productOverviewService: ProductOverviewService,
    private spinner: NgxSpinnerService,
    private toast: NgToastService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {}







  // UNDER REVIEW PRODUCT STARTING

  underReviewData: any;
  underReview_totalElements: number = 0;
  underReview_currentPage: number = 1;
  underReview_itemsPerPage: number = 10;
  // is Skeleton Loader Valid
  underReview_skeleton:any =false;

  getProductUnderReview() {
    this.getUnderReviewProduct({ page: "0", size: "10" });
  }

  getUnderReviewProduct(request: any) {
    this.underReview_skeleton = true;

    const user = this.tokenStorageService.getUser();

    this.productOverviewService
      .getUnderReviewProductService(request, user.username)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          
          this.underReviewData = res.data.content;
          this.underReview_totalElements = res.data.totalElements;
          this.underReview_currentPage = res.data.pageable.pageNumber;
          this.underReview_itemsPerPage = res.data.pageable.pageSize;
          this.underReview_skeleton = false;

          // this.toast.success({
          //   detail: 'Success',
          //   summary: 'Data Fetch Success',
          //   position: 'bottomRight',
          //   duration: 3000,
          // });
        },
        error: (err: any) => {
          this.underReview_skeleton = false;
          this.toast.error({
            detail: 'Error',
            summary: err.error.data?.message || 'Something went wrong',
            position: 'bottomRight',
            duration: 3000,
          });
        },
      });
}


nextPageUnderReview(event: PageEvent) {
    this.underReview_currentPage = event.pageIndex;
    this.underReview_itemsPerPage = event.pageSize;

    const request = {
        page: this.underReview_currentPage.toString(),
        size: this.underReview_itemsPerPage.toString()
    };
    this.getUnderReviewProduct(request);
}
   // UNDER REVIEW PRODUCT ENDING

// =============================================================================
// =============================================================================


// PRODUCT APPROVED STARTING
  approvedData: any;
  approved_totalElements: number = 0;
  approved_currentPage: number = 1;
  approved_itemsPerPage: number = 10;
  // is Skeleton Loader Valid
  approved_skeleton:any =false;

  getProductApproved() {
    this.getApprovedProduct({ page: "0", size: "10" });
  }

  getApprovedProduct(request: any) {
    this.approved_skeleton = true;

    const user = this.tokenStorageService.getUser();

    this.productOverviewService
      .getApprovedProductService(request, user.username)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          
          this.approvedData = res.data.content;
          this.approved_totalElements = res.data.totalElements;
          this.approved_currentPage = res.data.pageable.pageNumber;
          this.approved_itemsPerPage = res.data.pageable.pageSize;
          this.approved_skeleton = false;

          // this.toast.success({
          //   detail: 'Success',
          //   summary: 'Data Fetch Success',
          //   position: 'bottomRight',
          //   duration: 3000,
          // });
        },
        error: (err: any) => {
          this.approved_skeleton = false;
          this.toast.error({
            detail: 'Error',
            summary: err.error.data?.message || 'Something went wrong',
            position: 'bottomRight',
            duration: 3000,
          });
        },
      });
}


nextPageApproved(event: PageEvent) {
    this.approved_currentPage = event.pageIndex;
    this.approved_itemsPerPage = event.pageSize;

    const request = {
        page: this.approved_currentPage.toString(),
        size: this.approved_itemsPerPage.toString()
    };
    this.getApprovedProduct(request);
}
//PRODUCT APPROVED ENDING...





// =============================================================================
// =============================================================================








}
