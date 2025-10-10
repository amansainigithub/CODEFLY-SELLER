import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_AUTHORIZA_URL } from '../../constants/Constants';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class ProductOverviewService {
  constructor(private http: HttpClient) {}


  getUserAllProductService(request: any, username: any): Observable<any> {
    return this.http.post(
      API_AUTHORIZA_URL +
        'productOverviewController/' +
        'fetchAllUserProduct?page=' +
        request.page +
        '&size=' +
        request.size +
        '&username=' +
        username,
      httpOptions
    );
  }

  getUnderReviewProductService(request: any, username: any): Observable<any> {
    return this.http.post(
      API_AUTHORIZA_URL +
        'productOverviewController/' +
        'getUnderReviewProduct?page=' +
        request.page +
        '&size=' +
        request.size +
        '&username=' +
        username,
      httpOptions
    );
  }

  getApprovedProductService(request: any, username: any): Observable<any> {
    return this.http.post(
      API_AUTHORIZA_URL +
        'productOverviewController/' +
        'getApprovedProduct?page=' +
        request.page +
        '&size=' +
        request.size +
        '&username=' +
        username,
      httpOptions
    );
  }


    getDisApprovedProductService(request: any, username: any): Observable<any> {
    return this.http.post(
      API_AUTHORIZA_URL +
        'productOverviewController/' +
        'getDisApprovedProduct?page=' +
        request.page +
        '&size=' +
        request.size +
        '&username=' +
        username,
      httpOptions
    );
  }



    getDraftProductService(request: any, username: any): Observable<any> {
    return this.http.post(
      API_AUTHORIZA_URL +
        'productOverviewController/' +
        'getDraftProduct?page=' +
        request.page +
        '&size=' +
        request.size +
        '&username=' +
        username,
      httpOptions
    );
  }




}
