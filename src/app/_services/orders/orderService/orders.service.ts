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
  
    getOrders(request: any, username: any): Observable<any> {
      return this.http.post(
        API_AUTHORIZA_URL +
          'ordersController/' +'getActiveOrders?page=' + request.page +'&size='+request.size +'&username=' +username,httpOptions);
    }

    

    
  
}
