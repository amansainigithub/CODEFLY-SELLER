import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import { NgToastService } from 'ng-angular-popup';
import { SellerDataService } from '../seller-data.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { PincodeService } from '../../_services/pincodeService/pincode.service';
import { SellertaxService } from '../../_services/sellerTaxService/sellertax.service';
import { SellerPickupService } from '../../_services/sellerPickupService/seller-pickup.service';
import { SellerBankService } from '../../_services/sellerBankService/seller-bank.service';
import { SellerStoreService } from '../../_services/sellerStoreService/seller-store.service';

@Component({
  selector: 'app-seller-data-form',
  templateUrl: './seller-data-form.component.html',
  styleUrl: './seller-data-form.component.css'
})
export class SellerDataFormComponent {

  //Seller tax Form
  sellerTaxData:any={
    gstNumber:null,
    username:"",
    password:""
  }

  isLoggedIn = false;
  receivedData: any;
  isProvideDetailsLater:any;
  checkBox:any;


  constructor(private authService: AuthService, 
    private toast:NgToastService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private sellerDataService:SellerDataService,
    private pincodeService:PincodeService,
    private SellerTaxService:SellertaxService,
    private sellerPickService:SellerPickupService,
    private sellerBankService:SellerBankService ,
    private sellerStoreService:SellerStoreService  ) { }



  ngOnInit() {
    //Get seller Data jo set Kiya tha
    this.receivedData = this.sellerDataService.getData();

    //Check if any condition user directly access to this Page
    if(this.receivedData == null || this.receivedData == undefined || this.receivedData == "")
      {
       //this.router.navigateByUrl("/login");
       //return;
      }else if(this.receivedData !== null){
        //Set satate Data to sellerTaxData Object
        this.sellerTaxData.username = this.receivedData.mobile;
        this.sellerTaxData.password = this.receivedData.password;
      }
  }

//==========================================================================================================
//                                             ACCORDIAN  STARTING
//==========================================================================================================
  // Event handler for tab change
  accordianFirst:boolean = true;
  accordianSecond:boolean = false;
  accordianThird:boolean = false;
  accordianFourth:boolean = false;

onTabChange(event: MatTabChangeEvent) {
  console.log('Selected tab: ', event.tab.textLabel);

  if(event.tab.textLabel === "First")
  {
    this.accordianFirst = true;
    this.accordianSecond = false;
    this.accordianThird = false;
    this.accordianFourth = false;
  }

  if(event.tab.textLabel === "Second")
    {
      this.accordianFirst = false;
      this.accordianSecond = true;
      this.accordianThird = false;
      this.accordianFourth = false;
    }
  if(event.tab.textLabel === "Third")
    {
      this.accordianFirst = false;
      this.accordianSecond = false;
      this.accordianThird = true;
      this.accordianFourth = false;
    }  
  if(event.tab.textLabel === "Fourth")
    {
       this.accordianSecond = false;
       this.accordianThird = false;
       this.accordianFourth = false;
       this.accordianFourth = true;
   }  

}
//==========================================================================================================
//                                             ACCORDIAN  ENDING
//==========================================================================================================



  //==========================================================================================================
//                                             SELLER TAX VERIFIER STARTING
//============================================================================================================

  isClicked = false;
  isGstInputDisabled = false;
  SellerTaxVerifier()
  {
          //show Sprinner
          this.spinner.show();

          console.log("Verify Gst Process Starting...");
          console.log(this.sellerTaxData);

          this.SellerTaxService.verifySellerTaxService(this.sellerTaxData).subscribe(data => {
            const jsonObject = JSON.parse(JSON.stringify(data));

            //GST Verified Successfully
            if(jsonObject.data.message === "GST Verified")
            {
              this.toast.success({detail:"Gst Verified Success",summary:"Success", position:"topRight",duration:3000});
              // this.isClicked = true;  // Change button color and add tick icon
              // this.isGstInputDisabled = true;  
            }
            //Hide Sprinner
            this.spinner.hide();

          },
              err=>{
                // seller is already Verified
                if(err.error.data.message === "Gst Number already Used Another seller")
                  {
                    this.toast.warning({detail:"Gst Number already Used Another seller",summary:"Failed", position:"topRight",duration:3000});
                     //Hide Sprinner
                    this.spinner.hide();
                    return;  
                  }

                const jsonObject = JSON.parse(JSON.stringify(err));
                this.toast.success({detail:"Error",summary:"something Went Wrong", position:"topRight",duration:3000});
                //Hide Sprinner
                this.spinner.hide();
        })

  }
//==========================================================================================================
//                                             SELLER TAX VERIFIER ENDING
//============================================================================================================


//==========================================================================================================
//                                             SKIP SELLER  STARTING
//============================================================================================================

   //Skip Seller Data Starting
skipSellerData:any = false;
 skipSellerDetails(){
    // this.spinner.show();

    this.skipSellerData = true;

    //Clear Seller Data to Seller Object
    this.sellerDataService.clearData();

    setTimeout(() => {
        //Hide Spinner
          // this.spinner.hide();

          // this.router.navigateByUrl("/login");
          this.router.navigate(['/login']).then(() => {
            window.location.reload()
          })
        }, 3000);
   }
//==========================================================================================================
//                                             SKIP SELLER  STARTING
//============================================================================================================



//==========================================================================================================
//                                              PICKUP STARTING
//==========================================================================================================


   //PICKUP STARTING
 // Sample model for form
 pickupAddress = {
  addressLineOne: '',
  addressLineTwo: '',
  landmark: '',
  pincode: '',
  city: '',
  state:'',
  username:'',
  password:''
};

checkPincode(event: Event) {

  const inputElement = event.target as HTMLInputElement; // Cast the event target to HTMLInputElement
  const value = inputElement.value; // Get the input value

  if (value.length === 6) {
    
        //Show Spinner
        this.spinner.show();
        this.pincodeService.verifyPincode(value).subscribe(data=>{
        console.log(data);
        const resp = JSON.parse(JSON.stringify(data));
      
        this.pickupAddress.city  = resp.data.data.District;
        this.pickupAddress.state = resp.data.data.State;

        this.pickupAddress.username  = this.sellerTaxData.username;
        this.pickupAddress.password = this.sellerTaxData.password;

       
        //Show Spinner
        this.spinner.hide();
    },err=>{
        console.log(err);
        
        //Show Spinner
        this.spinner.hide();
    })
  }
}


savePickUp()
{

   //Show Spinner
   this.spinner.show();

        this.sellerPickService.savePickup(this.pickupAddress).subscribe(data=>{
                
          this.toast.success({detail:"Success",summary:"Pick Saved", position:"topRight",duration:3000});
          //Hide Sprinner
          this.spinner.hide();
        },err=>{
          this.toast.error({detail:"Failed",summary:"PickUp Address Not saved", position:"topRight",duration:3000});
          //Hide Sprinner
          this.spinner.hide();
        });
}

//==========================================================================================================
//                                              PICKUP ENDING
//==========================================================================================================




//==========================================================================================================
//                                              BANK DETAILS STARTING
//==========================================================================================================


bankDetailsForm={
  bankName:'',
  accountNumber:'',
  ifscCode:'',
  username:'',
  password:''
}


saveSellerBankDetails()
{

  this.bankDetailsForm.username  = this.sellerTaxData.username;
  this.bankDetailsForm.password = this.sellerTaxData.password;

     //Show Spinner
   this.spinner.show();

   this.sellerBankService.savebankDetails(this.bankDetailsForm).subscribe(data=>{
           
     this.toast.success({detail:"Success",summary:"Bank Details Saved Success", position:"topRight",duration:3000});
     //Hide Sprinner
     this.spinner.hide();
   },err=>{
     this.toast.error({detail:"Failed",summary:"Bank Already Used for another seller", position:"topRight",duration:3000});
     //Hide Sprinner
     this.spinner.hide();
   });
}

//==========================================================================================================
//                                             BANK DETAILS ENDING
//==========================================================================================================





//==========================================================================================================
//                                              SELLER STORE STARTING
//==========================================================================================================
sellerStoreForm={
  storeName:'',
  username:'',
  password:''
}

saveSellerStore()
{
  
  this.sellerStoreForm.username  = this.sellerTaxData.username;
  this.sellerStoreForm.password = this.sellerTaxData.password;

     //Show Spinner
   this.spinner.show();

   this.sellerStoreService.saveStoreDetails(this.sellerStoreForm).subscribe(data=>{
           
     this.toast.success({detail:"Success",summary:"Store Saved Success", position:"topRight",duration:3000});
     //Hide Sprinner
     this.spinner.hide();
   },err=>{
     this.toast.error({detail:"Failed",summary:"Store Saved Failed", position:"topRight",duration:3000});
     //Hide Sprinner
     this.spinner.hide();
   });
}
  

//==========================================================================================================
//                                              SELLER STORE STARTING
//==========================================================================================================



}
