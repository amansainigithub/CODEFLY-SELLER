import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_AUTHORIZA_URL } from '../../../constants/Constants';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ProductDetailsService {
  constructor(private http: HttpClient) {}

  saveProductDetails(productData: any, variantId: any): Observable<any> {
    return this.http.post(
      API_AUTHORIZA_URL + 'productController/saveProductDetails/' + variantId,
      productData
    );
  }

  fileUploadService(files: any,productId:any): Observable<any> {
    return this.http.post(
      API_AUTHORIZA_URL + 'productController/' + 'saveProductFiles/' +productId,
      files
    );
  }
}
