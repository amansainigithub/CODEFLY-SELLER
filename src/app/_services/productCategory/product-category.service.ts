import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_AUTHORIZA_URL } from '../../constants/Constants';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  constructor(private http: HttpClient) { }

 getRootCategory(): Observable<any> {
      return this.http.get(API_AUTHORIZA_URL + "productCategoryController/"+ 'getRootCategory', httpOptions);
    }

 getSubCategory(id:any): Observable<any> {
      return this.http.get(API_AUTHORIZA_URL + "productCategoryController/"+ 'getSubCategory/'+id, httpOptions);
    }

    getTypeCategory(id: any): Observable<any> {
  return this.http.get(API_AUTHORIZA_URL + "productCategoryController/" + 'getTypeCategory/' + id, httpOptions);
}

getVariantCategory(id: any): Observable<any> {
  return this.http.get(API_AUTHORIZA_URL + "productCategoryController/" + 'getVariantCategory/' + id, httpOptions);
}




}
