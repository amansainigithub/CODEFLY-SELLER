import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductOverviewService } from '../../_services/productOverviewService/product-overview.service';
import { PageEvent } from '@angular/material/paginator';
import { TokenStorageService } from '../../_services/token-storage.service';
import { Router } from '@angular/router';
declare var bootstrap: any; // Declare bootstrap for accessing modal methods

@Component({
  selector: 'app-product-overview',
  templateUrl: './product-overview.component.html',
  styleUrl: './product-overview.component.css',
})
export class ProductOverviewComponent {


  // USER ALL PRODUCT STARTING
  userAllProductData: any;
  userAllProduct_totalElements: number = 0;
  userAllProduct_currentPage: number = 1;
  userAllProduct_itemsPerPage: number = 10;
  // is Skeleton Loader Valid
  userAllProduct_skeleton: any = false;

  //Product Counts
  totalProducts:any
  underReviewCount:any;
  approvedCount:any;
  disApprovedCount:any;
  draftCount:any;

  constructor(
    private productOverviewService: ProductOverviewService,
    private spinner: NgxSpinnerService,
    private toast: NgToastService,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserAllProductData()
  }




  // =============================================================================


  getUserAllProductData() {
    this.fetchUserAllProduct({ page: '0', size: '10' });
  }

  fetchUserAllProduct(request: any) {
    this.userAllProduct_skeleton = true;

    const user = this.tokenStorageService.getUser();

    this.productOverviewService
      .getUserAllProductService(request, user.username)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          
          this.userAllProductData = res.data.overviewPageData.content;
          this.userAllProduct_totalElements = res.data.overviewPageData.totalElements;
          this.userAllProduct_currentPage = res.data.overviewPageData.pageable.pageNumber;
          this.userAllProduct_itemsPerPage = res.data.overviewPageData.pageable.pageSize;
          this.userAllProduct_skeleton = false;

          //Manage Product Counts
          this.totalProducts = res.data.totalProducts;
          this.underReviewCount = res.data.underReviewCount;
          this.approvedCount = res.data.approvedCount;
          this.disApprovedCount = res.data.disApprovedCount;
          this.draftCount = res.data.draftCount;        
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
    this.userAllProduct_currentPage = event.pageIndex;
    this.userAllProduct_itemsPerPage = event.pageSize;

    const request = {
      page: this.userAllProduct_currentPage.toString(),
      size: this.userAllProduct_itemsPerPage.toString(),
    };
    this.fetchUserAllProduct(request);
  }
  // USER ALL PRODUCT ENDING

  // =============================================================================
  // =============================================================================






  // UNDER REVIEW PRODUCT STARTING

  underReviewData: any;
  underReview_totalElements: number = 0;
  underReview_currentPage: number = 1;
  underReview_itemsPerPage: number = 10;
  // is Skeleton Loader Valid
  underReview_skeleton: any = false;

  getProductUnderReview() {
    this.getUnderReviewProduct({ page: '0', size: '10' });
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
      size: this.underReview_itemsPerPage.toString(),
    };
    this.getUnderReviewProduct(request);
  }

  modifiedProductFiles(productId:any)
  {
    this.router.navigateByUrl('/seller/dashboard/home/modified-product-files', {
        state: { productId: productId },  
      });
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
  approved_skeleton: any = false;

  getProductApproved() {
    this.getApprovedProduct({ page: '0', size: '10' });
  }

  getApprovedProduct(request: any) {
    this.approved_skeleton = true;

    const user = this.tokenStorageService.getUser();

    this.productOverviewService
      .getApprovedProductService(request, user.username)
      .subscribe({
        next: (res: any) => {
          this.approvedData = res.data.content;
          this.approved_totalElements = res.data.totalElements;
          this.approved_currentPage = res.data.pageable.pageNumber;
          this.approved_itemsPerPage = res.data.pageable.pageSize;
          this.approved_skeleton = false;
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
      size: this.approved_itemsPerPage.toString(),
    };
    this.getApprovedProduct(request);
  }
  //PRODUCT APPROVED ENDING...







  
  // =============================================================================
  // =============================================================================

  // PRODUCT DIS-APPROVED STARTING
  disApprovedData: any;
  disApproved_totalElements: number = 0;
  disApproved_currentPage: number = 1;
  disApproved_itemsPerPage: number = 10;
  // is Skeleton Loader Valid
  disApproved_skeleton: any = false;

  getDisProductApproved() {
    this.getDisApprovedProduct({ page: '0', size: '10' });
  }

  getDisApprovedProduct(request: any) {    
    this.disApproved_skeleton = true;

    const user = this.tokenStorageService.getUser();

    this.productOverviewService.getDisApprovedProductService(request, user.username)
      .subscribe({
        next: (res: any) => {
          this.disApprovedData = res.data.content;
          this.disApproved_totalElements = res.data.totalElements;
          this.disApproved_currentPage = res.data.pageable.pageNumber;
          this.disApproved_itemsPerPage = res.data.pageable.pageSize;
          this.disApproved_skeleton = false;
        },
        error: (err: any) => {
          this.disApproved_skeleton = false;
          this.toast.error({
            detail: 'Error',
            summary: err.error.data?.message || 'Something went wrong',
            position: 'bottomRight',
            duration: 3000,
          });
        },
      });
  }

  nextPageDisApproved(event: PageEvent) {
    this.disApproved_currentPage = event.pageIndex;
    this.disApproved_itemsPerPage = event.pageSize;

    const request = {
      page: this.disApproved_currentPage.toString(),
      size: this.disApproved_itemsPerPage.toString(),
    };
    this.getDisApprovedProduct(request);
  }
  //PRODUCT DIS-APPROVED ENDING...

  // =============================================================================
  // =============================================================================





  // PRODUCT DRAFT STARTING
  draftData: any;
  draft_totalElements: number = 0;
  draft_currentPage: number = 1;
  draft_itemsPerPage: number = 10;
  // is Skeleton Loader Valid
  draft_skeleton: any = false;

  getDraftProductData() {
    this.getDraftProduct({ page: '0', size: '10' });
  }

  getDraftProduct(request: any) {    
    this.draft_skeleton = true;

    const user = this.tokenStorageService.getUser();

    this.productOverviewService.getDraftProductService(request, user.username)
      .subscribe({
        next: (res: any) => {
          this.draftData = res.data.content;
          this.draft_totalElements = res.data.totalElements;
          this.draft_currentPage = res.data.pageable.pageNumber;
          this.draft_itemsPerPage = res.data.pageable.pageSize;
          this.draft_skeleton = false;
        },
        error: (err: any) => {
          this.draft_skeleton = false;
          this.toast.error({
            detail: 'Error',
            summary: err.error.data?.message || 'Something went wrong',
            position: 'bottomRight',
            duration: 3000,
          });
        },
      });
  }

  nextPageProductDraft(event: PageEvent) {
    this.draft_currentPage = event.pageIndex;
    this.draft_itemsPerPage= event.pageSize;

    const request = {
      page: this.draft_currentPage.toString(),
      size: this.draft_itemsPerPage.toString(),
    };
    this.getDisApprovedProduct(request);
  }
  //PRODUCT DRAFT ENDING...

  // =============================================================================
  // =============================================================================





  // ===================================================================================
  //ADD VARINAT STARTING..
  productData:any;
  addVariant(productData: any) {
     this.productData = {
      productId: productData.id,
      productKey : productData.productKey,
      variantId : productData.variantId
    };

    this.modelShow();
  }

  continueAddVariant() {
    console.log("CONTINUE TO ADD VARIANT PROCESS STARTING....");
    console.log(this.productData);
    // mode Hide
    this.modelClose();
    this.router.navigateByUrl('/seller/dashboard/home/product-Variant', {state: this.productData});
  }
  //ADD VARINAT ENDING...











// MODEL PROPERTIES STARTING
  // =============================================================================
  // =============================================================================

  //Progress Bar
  progressBar: any = false;

  // MODEL PROPERTIES STARTING
  @ViewChild('variantModel') variantModel!: ElementRef;
  modelShow() {
    const modal = new bootstrap.Modal(this.variantModel.nativeElement);
    modal.show();
  }
  modelClose() {
    const modal = bootstrap.Modal.getInstance(this.variantModel.nativeElement);
    modal?.hide();
  }
  // MODEL PROPERTIES ENDING
  // ============================================================================================
  // =============================================================================











}
