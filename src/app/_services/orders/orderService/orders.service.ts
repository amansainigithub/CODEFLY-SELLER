import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_AUTHORIZA_URL } from '../../../constants/Constants';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) {}
  
    getPendingOrders(request: any, username: any): Observable<any> {
      return this.http.post(
        API_AUTHORIZA_URL +
          'ordersController/' +'getPendingOrders?page=' + request.page +'&size='+request.size +'&username=' +username,httpOptions);
    }

    getConfirmedOrders(request: any, username: any): Observable<any> {
      return this.http.post(
        API_AUTHORIZA_URL +
          'ordersController/' +'getConfirmedOrders?page=' + request.page +'&size='+request.size +'&username=' +username,httpOptions);
    }

    getShippedOrders(request: any, username: any): Observable<any> {
      return this.http.post(
        API_AUTHORIZA_URL +
          'ordersController/' +'getShippedOrders?page=' + request.page +'&size='+request.size +'&username=' +username,httpOptions);
    }    


    getdeliveredOrders(request: any, username: any): Observable<any> {
      return this.http.post(
        API_AUTHORIZA_URL +
          'ordersController/' +'getDeliveredOrders?page=' + request.page +'&size='+request.size +'&username=' +username,httpOptions);
    }   
 
    
    
    getCancelledOrders(request: any, username: any): Observable<any> {
      return this.http.post(
        API_AUTHORIZA_URL +
          'ordersController/' +'getCancelledOrders?page=' + request.page +'&size='+request.size +'&username=' +username,httpOptions);
    }   

    
  
}
