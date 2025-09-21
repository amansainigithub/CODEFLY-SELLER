import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductDetailsService } from '../../../_services/productUploadService/productDetails/product-details.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgToastService } from 'ng-angular-popup';

declare var bootstrap: any; // Declare bootstrap for accessing modal methods

@Component({
  selector: 'app-product-files',
  templateUrl: './product-files.component.html',
  styleUrl: './product-files.component.css',
})
export class ProductFilesComponent {
  productData: any;
  finalCategory: any;

  //Progress Bar
  progressBar: any = false;

  constructor(
    private router: Router,
    private productDetails: ProductDetailsService,
    private spinner: NgxSpinnerService,
    private toast: NgToastService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as {
      formData: any;
      finalCategory: any;
    };

    if (state && state.formData !== undefined && state.formData !== null) {
      this.productData = state.formData;
    } else {
      this.router.navigateByUrl('/seller/dashboard/home');
    }

    if (state && state.finalCategory !== undefined && state.finalCategory !== null) {
      this.finalCategory = state.finalCategory;
    } else {
      this.router.navigateByUrl('/seller/dashboard/home');
    }

    if (this.validateFormAndCategory()) {
      console.log('✅ Valid data hai');
      console.log(this.productData);
      console.log(this.finalCategory);
    } else {
      console.log('Invalid data (null/blank/empty)');
      this.router.navigateByUrl('/seller/dashboard/home');
    }
  }

  // ngOnInit(): void {
  //   setTimeout(() => {
  //     this.prefillFiles();
  //   }, 2000);
  // }

  //Check Category and Product Form Data is Valid or Not
  validateFormAndCategory(): boolean {
    if (
      this.productData &&
      Object.keys(this.productData).length > 0 &&
      this.finalCategory &&
      Object.keys(this.finalCategory).length > 0 &&
      this.finalCategory.vData &&
      this.finalCategory.vData.id !== null &&
      this.finalCategory.vData.id !== undefined &&
      this.finalCategory.vData.id !== ''
    ) {
      return true;
    } else {
      return false;
    }
  }

  // ================IMAGE UPLOAD=================================

  imageSlots: (string | ArrayBuffer | null)[] = [null, null, null, null, null]; // 5 slots
  files: (File | null)[] = [null, null, null, null, null]; // store original files

  onFileSelected(event: any, index: number) {
    const fileInput = event.target as HTMLInputElement;
    const file: File | null = fileInput.files ? fileInput.files[0] : null;

    if (file) {
      // Allowed file types
      const allowedTypes = ['image/png', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only PNG and JPG/JPEG images are allowed!');
        this.files[index] = null;
        this.imageSlots[index] = null;
        fileInput.value = ''; // reset input
        return;
      }

      // File size check (max 5 MB)
      const maxSize = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSize) {
        alert('File size must be less than 5 MB!');
        this.files[index] = null;
        this.imageSlots[index] = null;
        fileInput.value = ''; // reset input
        return;
      }

      // Agar valid hai to slot me set karo
      this.files[index] = file;
      const reader = new FileReader();
      reader.onload = () => (this.imageSlots[index] = reader.result);
      reader.readAsDataURL(file);
    }

    //Same file dobara select kar sake uske liye reset karna zaroori hai
    fileInput.value = '';
  }

  triggerFileInput(index: number) {
    document.getElementById('fileInput' + index)?.click();
  }

  removeImage(event: MouseEvent, index: number) {
    event.stopPropagation();
    this.imageSlots[index] = null;
    this.files[index] = null;
  }

  // ===================VIDEO UPLOAD==================

  videoUrl: string | null = null;
  videoFile: File | null = null;

  onVideoSelected(event: any) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension !== 'mp4') {
        alert('Only MP4 format is allowed!');
        fileInput.value = ''; // reset input
        return;
      }
      if (fileSizeInMB < 1) {
        alert('Video size must be at least 1 MB!');
        fileInput.value = ''; // reset input
        return;
      }
      if (fileSizeInMB > 50) {
        alert('Video size must not exceed 50 MB!');
        fileInput.value = ''; // reset input
        return;
      }

      this.videoFile = file;
      this.videoUrl = URL.createObjectURL(file);
    }

    //MAKE IT SO THE SAME FILE CAN BE UPLOADED AGAIN (RESET).
    fileInput.value = '';
  }

  removeVideo(event: MouseEvent) {
    event.stopPropagation();
    this.videoUrl = null;
    this.videoFile = null;
  }

  // ==========================SAVE PRODUCT DETAILS======================================

  productUploadStatus: any = false;

  submitProduct() {
    if (!this.files[0]) {
      this.toast.error({
        detail: 'Please upload Main image before submitting!',
        summary: 'Error',
        position: 'bottomRight',
        duration: 2000,
      });
      return;
    } else {
      //Show Model
      this.productProceedModelShow();
    }
  }

  productSubmit() {
    //SPINNER SHOWING
    this.spinner.show();

    this.productDetails
      .saveProductDetails(this.productData, this.finalCategory.vData.id)
      .subscribe({
        next: async (res: any) => {
          if (res.data.id) {
            console.log('Product ID:', res.data.id);
            try {
              // Wait until the response is received
              const fileRes = await this.saveProductFiles(res.data.id);
              console.log('Files response:', fileRes);

              //CHANGE PRODUCT UPLOAD STATUS VALUE
              this.productUploadStatus = true;

              //SPINNER CLOSE
              this.spinner.hide();

              //CLOSING MODEL AFER SOME TIME
              setTimeout(() => {
                this.router.navigate(['/seller/dashboard/home']);
                //CLOSING MODEL
                this.proceedModelClose();
              }, 2000);
            } catch (err) {
              this.toast.error({
                detail: 'Failed to save Product Details',
                summary: 'Error',
                position: 'bottomRight',
                duration: 2000,
              });
              //SPINNER CLOSE
              this.spinner.hide();
              //CLOSING MODEL
              this.proceedModelClose();
              //this.router.navigate(['/seller/dashboard/home']);
            }
          } else {
            console.log('Product ID Not Found....');
            this.toast.error({
              detail: 'Product ID Not Found....',
              summary: 'Error',
              position: 'bottomRight',
              duration: 2000,
            });
            //SPINNER CLOSE
            this.spinner.hide();
          }
          this.spinner.hide();
        },
        error: (err: any) => {
          alert(err);
          this.spinner.hide();
        },
      });
  }

  saveProductFiles(productId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.files[0]) {
        alert('Please upload Main image before submitting!');
        return;
      }

      const formData = new FormData();
      this.files.forEach((file) => {
        if (file) {
          formData.append('files', file);
        }
      });

      if (this.videoFile) {
        formData.append('video', this.videoFile);
      }
      this.productDetails.fileUploadService(formData, productId).subscribe({
        next: (res: any) => resolve(res),
        error: (err: any) => reject(err),
      });
    });
  }

  // ============================================================================================

  // MODEL PROPERTIES STARTING
  @ViewChild('proceedModel') proceedModel!: ElementRef;
  productProceedModelShow() {
    const modal = new bootstrap.Modal(this.proceedModel.nativeElement);
    modal.show();
  }
  proceedModelClose() {
    const modal = bootstrap.Modal.getInstance(this.proceedModel.nativeElement);
    modal?.hide();
  }
  // MODEL PROPERTIES ENDING

  // ============================================================================================

























  //======================PRE-FILL DATA STARTING=======================
  prefillFiles() {
    const defaultImgUrl =
      'https://res.cloudinary.com/dgidcgrxs/image/upload/v1744827500/megamart/ProductImages/c1s2axjdbneybvhgyaym.jpg';
    const defaultVideoUrl =
      'https://res.cloudinary.com/dgidcgrxs/video/upload/v1758027410/5f795368-928f-47d9-a94c-73210bd3f708_eo2o3v.mp4';

    // 🔹 Sabhi slots ke liye default image set karna
    this.imageSlots = [
      defaultImgUrl,
      defaultImgUrl,
      defaultImgUrl,
      defaultImgUrl,
      defaultImgUrl,
    ];

    // 🔹 Image ko fetch karke File[] me convert karna
    fetch(defaultImgUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const defaultFile = new File([blob], 'default.jpg', {
          type: blob.type,
        });
        this.files = [
          defaultFile,
          defaultFile,
          defaultFile,
          defaultFile,
          defaultFile,
        ];
      });

    // 🔹 Video preview ke liye default video URL
    this.videoUrl = defaultVideoUrl;

    // 🔹 Video ko fetch karke File me convert karna
    fetch(defaultVideoUrl)
      .then((res) => res.blob())
      .then((blob) => {
        this.videoFile = new File([blob], 'default.mp4', { type: blob.type });
      });
  }
  //======================PRE-FILL DATA ENDING=======================
}
