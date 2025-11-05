import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_AUTHORIZA_URL } from '../../../constants/Constants';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ProductInventoryService {
  constructor(private http: HttpClient) {}

  getAllInventoryProducts(request: any, username: any): Observable<any> {
    return this.http.post(
      API_AUTHORIZA_URL +
        'inventoryController/' +
        'getAllInventory?page=' +
        request.page +
        '&size=' +
        request.size +
        '&username=' +
        username,
      httpOptions
    );
  }

    getOutOfStocksProducts(request: any, username: any): Observable<any> {
    return this.http.post(
      API_AUTHORIZA_URL +
        'inventoryController/' +
        'getOutOfStockProduct?page=' +
        request.page +
        '&size=' +
        request.size +
        '&username=' +
        username,
      httpOptions
    );
  }

  getLowStocksProducts(request: any, username: any): Observable<any> {
    return this.http.post(
      API_AUTHORIZA_URL +
        'inventoryController/' +
        'getLowStockProduct?page=' +
        request.page +
        '&size=' +
        request.size +
        '&username=' +
        username,
      httpOptions
    );
  }


   updateProductInventory(updateProductInventory: any): Observable<any> {
    return this.http.post(API_AUTHORIZA_URL + 'inventoryController/updateProductInventory',updateProductInventory);
  }
}
