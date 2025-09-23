import { Component } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductOverviewService } from '../../_services/productOverviewService/product-overview.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-product-overview',
  templateUrl: './product-overview.component.html',
  styleUrl: './product-overview.component.css'
})
export class ProductOverviewComponent {

  isChecked = true;
  underReviewData:any;
  totalElements: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;

    constructor(private productOverviewService:ProductOverviewService,
    private spinner: NgxSpinnerService,
    private toast:NgToastService
  ) {}

  ngOnInit(): void {
    this.getUnderReviewProduct({ page: "0", size: "10" });
  }


    getUnderReviewProduct(request:any)
  {
    this.spinner.show();
    this.productOverviewService.getUnderReviewProduct(request)
    .subscribe(
      {
          next:(res:any)=> {
            console.log(res);
            
          this.underReviewData = res.data['content']
          this.totalElements = res.data['totalElements'];
          this.toast.success({detail:"Success",summary:"Data Fetch Success", position:"bottomRight",duration:3000});
          this.spinner.hide();
        },
        error:(err:any)=>  {
          console.log(err);
          this.spinner.hide();
          this.toast.error({detail:"Error",summary:err.error.data.message, position:"bottomRight",duration:3000});
        }
      }
    );
  }


    nextPage(event: PageEvent) {
    console.log(event);
    const request:any = {};
    request['page'] = event.pageIndex.toString();
    request['size'] = event.pageSize.toString();
    this.getUnderReviewProduct(request);
}

}
