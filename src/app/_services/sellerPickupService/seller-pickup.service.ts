import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SELLER_PUBLIC_URL } from '../../constants/Constants';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class SellerPickupService {

  constructor(private http: HttpClient) { }

  
  savePickup(pickUp:any): Observable<any> {
    return this.http.post(SELLER_PUBLIC_URL + 'sellerPickupController/'+ 'sellerPickup', pickUp);
  }


  // ============================SELLER REGISTERATION 2 DATA==============================================


sendotp(mobile:any): Observable<any> {
    return this.http.post(SELLER_PUBLIC_URL + 'sellerPickupController/' + 'send-otp', {mobile});
  }


  verifyOtp(id: number, otp: string) {
    return this.http.post(SELLER_PUBLIC_URL + 'sellerPickupController/' + 'verify-otp', { id, otp });
  }




 // STEP 3: Save Business Details (Dummy backend call)
  saveBusinessDetails(id: number, data: any): Observable<any> {
    // 🔹 Option 1: Real backend call
    return this.http.post(SELLER_PUBLIC_URL + 'sellerPickupController/' + 'save-business/'+id, data);
  }




  // STEP 4: Save Pickup Address
savePickupAddress(id: number, data: any): Observable<any> {
  return this.http.post(SELLER_PUBLIC_URL + 'sellerPickupController/' + 'save-pickup/'+id, data);
}


// STEP 5: Save Bank Details
saveBankDetails(id: number, data: any): Observable<any> {
  return this.http.post(SELLER_PUBLIC_URL + 'sellerPickupController' + '/save-bank/'+id, data);
}



// STEP 6: Save Store Name + Final Submit
saveStoreName(id: number, data: any): Observable<any> {
  return this.http.post(SELLER_PUBLIC_URL + 'sellerPickupController' + '/save-store-name/'+id,data);
}


}
