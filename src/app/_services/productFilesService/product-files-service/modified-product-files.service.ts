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
export class ModifiedProductFilesService {

    constructor(private http: HttpClient) {}

    getProductFilesByIdService(productId:any,username:any): Observable<any> {
        return this.http.get(API_AUTHORIZA_URL + "productFilesHandlerController/"
           + 'getProductFilesByIdSeller/'+productId +"/"+username, httpOptions);
    }

    
   modifiedFilesService(formData:any ,fileId:any,productId:any,username:any): Observable<any> {
    return this.http.post(API_AUTHORIZA_URL + "productFilesHandlerController/" + 'modifiedProductFilesBySeller/'
      +fileId + "/" + productId+"/"+username , formData);
  }

     modifiedVideoFilesService(formData:any ,fileId:any,productId:any,username:any): Observable<any> {
    return this.http.post(API_AUTHORIZA_URL + "productFilesHandlerController/" + 'modifiedProductVideoFilesBySeller/'
      +fileId + "/" + productId+"/"+username , formData);
  }

}
