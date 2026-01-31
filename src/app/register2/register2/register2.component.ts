import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellertaxService } from '../../_services/sellerTaxService/sellertax.service';
import { SellerPickupService } from '../../_services/sellerPickupService/seller-pickup.service';

@Component({
  selector: 'app-register2',
  templateUrl: './register2.component.html',
  styleUrl: './register2.component.css'
})
export class Register2Component {
step = 1;
sellerId!: number;
error = '';

constructor(private fb: FormBuilder,
            private sellerPickupService: SellerPickupService) {}

// STEP 1 FORM
mobileForm = this.fb.group({
  mobile: ['', [
    Validators.required,
    Validators.pattern('[6-9][0-9]{9}')
  ]]
});

// STEP 2 FORM
otpForm = this.fb.group({
  otp: ['', [
    Validators.required,
    // Validators.pattern('[0-9]{6}')
  ]]
});

// STEP 3 FORM - Business Details
businessForm = this.fb.group({
  sellerName: ['', Validators.required],
  businessType: ['', Validators.required],
  hasGst: [false],
  gstNumber: ['']
});

// ----------------- STEP FUNCTIONS -----------------

// STEP 1 → SEND OTP
sendOtp() {
  if (this.mobileForm.invalid) return;

  this.sellerPickupService.sendotp(this.mobileForm.value.mobile!)
    .subscribe((res: any) => {
      this.sellerId = res.id;
      localStorage.setItem('sellerId', this.sellerId.toString());
      this.step = 2;
    });
}

// STEP 2 → VERIFY OTP
verifyOtp() {
  if (this.otpForm.invalid) return;

  this.sellerPickupService.verifyOtp(this.sellerId, this.otpForm.value.otp!)
    .subscribe({
      next: (res:any) => {
        alert(res.message); // OTP verified successfully
        this.step = 3;
      },
      error: (err) => {
        alert(err.error.message); // Invalid OTP
      }
    });
}

// STEP 3 → SAVE BUSINESS DETAILS
nextBusinessStep() {
  if (this.businessForm.invalid) return;

  // GST validation
  if (this.businessForm.value.hasGst && !this.businessForm.value.gstNumber) {
    this.error = 'Please enter GST Number';
    return;
  }

  this.error = '';

  // Dummy backend save
  this.sellerPickupService.saveBusinessDetails(this.sellerId, this.businessForm.value)
    .subscribe({
      next: (res:any) => {
        alert(res.message); // Business Details Saved
        this.step = 4; // next step → pickup address
      },
      error: () => {
        alert('Error saving business details');
      }
    });
}




// STEP 4 FORM
pickupForm = this.fb.group({
  addressLine1: ['', Validators.required],
  addressLine2: [''],
  city: ['', Validators.required],
  state: ['', Validators.required],
  // pincode: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],
  // phone: ['', [Validators.required, Validators.pattern('[6-9][0-9]{9}')]]
});

// STEP 4 → SAVE PICKUP ADDRESS
savePickupAddress() {
  if (this.pickupForm.invalid) return;

  this.sellerPickupService.savePickupAddress(this.sellerId, this.pickupForm.value)
    .subscribe({
      next: (res:any) => {
        alert(res.message); // Pickup address saved
        this.step = 5; // next step → Bank Details
      },
      error: (err:any) => {
        alert(err.error.message || 'Error saving pickup address');
      }
    });
}






// STEP 5 FORM - Bank Details
bankForm = this.fb.group({
  bankName: ['', Validators.required],
  // accountNumber: ['', [Validators.required, Validators.pattern('[0-9]{9,18}')]],
  // ifsc: ['', [Validators.required, Validators.pattern('[A-Z]{4}0[A-Z0-9]{6}')]],
  accountType: ['', Validators.required] // Savings / Current
});

// STEP 5 → SAVE BANK DETAILS
saveBankDetails() {
  if (this.bankForm.invalid) return;

  this.sellerPickupService.saveBankDetails(this.sellerId, this.bankForm.value)
    .subscribe({
      next: (res:any) => {
        alert(res.message); // Bank details saved
        this.step = 6; // next step → Category Selection / Final Submit
      },
      error: (err) => {
        alert(err.error.message || 'Error saving bank details');
      }
    });
}





// STEP 6 FORM - Store Name
storeForm = this.fb.group({
  storeName: ['', Validators.required]
});

// STEP 6 → SAVE STORE NAME + FINAL SUBMIT
saveStoreNameStep() {
  if (this.storeForm.invalid) return;

  this.sellerPickupService.saveStoreName(this.sellerId, this.storeForm.value)
    .subscribe({
      next: (res:any) => {
        alert(res.message); // Seller registration submitted
        this.step = 7; // Registration complete
      },
      error: (err) => {
        alert(err.error.message || 'Error submitting seller registration');
      }
    });
}










}
