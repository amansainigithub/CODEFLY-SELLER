import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_AUTHORIZA_URL } from '../../../constants/Constants';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProductVariantService {

  constructor(private http: HttpClient) { }
  

   loadProductDetails(productId:any): Observable<any> {
        return this.http.get(API_AUTHORIZA_URL + "productVariantController/"+ 'loadProductDetails/' + productId, httpOptions);
      }


    saveProductVariantDetails(productData: any, variantId: any,productId:any): Observable<any> {
    return this.http.post(
      API_AUTHORIZA_URL + 'productVariantController/saveProductVariantDetails/' + variantId +"/" + productId,
      productData
    );
  }

    VariantfileUploadService(files: any,productId:any , existingProductId:any): Observable<any> {
    return this.http.post(
      API_AUTHORIZA_URL + 'productVariantController/' + 'saveProductVariantFiles/' +productId + "/" + existingProductId,
      files
    );
  }
}
