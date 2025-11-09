import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModifiedProductFilesService } from '../../../_services/productFilesService/modifiedFiles/modified-product-files.service';
import { TokenStorageService } from '../../../_services/token-storage.service';
declare var bootstrap: any;
@Component({
  selector: 'app-modifiled-product-files',
  templateUrl: './modifiled-product-files.component.html',
  styleUrl: './modifiled-product-files.component.css'
})
export class ModifiledProductFilesComponent {

  productId:any;
  productData:any;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private toast: NgToastService,
    private modifiedProductFiles:ModifiedProductFilesService,
    private tokenStorageService:TokenStorageService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { productId: any };
    console.log(state);
    
    if (state && state.productId) {
      this.productId = state.productId;
      // alert(' Product ID provided '+ this.productId);
      this.getProductFilesById(this.productId);
    } else {
      alert('No Product ID provided. Redirecting to Dashboard.');
      //this.router.navigateByUrl('/seller/dashboard/home');
    }
  }


    // 🟢 Fetch product files from backend and prefill
  getProductFilesById(productId: any) {
    const user = this.tokenStorageService.getUser();
    this.modifiedProductFiles.getProductFilesByIdService(productId , user.username).subscribe({
      next: (res: any) => {
        console.log('Product Files Response:', res);
        this.productData = res.data;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }




  // MODIFIED IMAGE FILES
  selectedImageUrl: string | null = null;
  currentFileId:any;
  selectedFile: File | null = null;
  previewUrl:any = null;
  selectedIndex: number | null = null;

  modifiedImageFile(index: number) {
    this.selectedIndex = index;
    this.selectedImageUrl = this.productData[index].fileUrl;
    this.currentFileId = this.productData[index].id;

    this.modelShow();
  }

  formData:any = new FormData();
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => (this.previewUrl = e.target?.result);
      reader.readAsDataURL(file);

      //MODIFIED PRODUCT FILES 
      this.formData.append('files', file);
      if (this.currentFileId) {
        this.formData.append('fileId', this.currentFileId);
      }
    }
  }

  updateFile() {
    if (!this.selectedFile || this.selectedIndex === null) return;

    //Get Username
    const user = this.tokenStorageService.getUser();

    this.spinner.show();
    this.modifiedProductFiles.modifiedFilesService(this.formData, this.currentFileId , this.productId , user.username).subscribe({
      next: (res: any) => {
        console.log('Upload success:', res);
         this.toast.success({detail:"Success",summary:"File Update success", position:"topRight",duration:2000});
        this.spinner.hide();

        //get Product Files
        this.getProductFilesById(this.productId);

        window.location.reload();
      },
      error: (err: any) => {
        console.error('Upload error:', err);
        this.toast.error({detail:"Error",summary:"File Update Failed", position:"topRight",duration:2000});
        this.spinner.hide();

        window.location.reload();
      },
    });
    
  }














  // MODEL PROPERTIES STARTING
    // =============================================================================
    // =============================================================================
  
    //Progress Bar
    progressBar: any = false;
  
    // MODEL PROPERTIES STARTING
    @ViewChild('modifiedImageModel') modifiedImageModel!: ElementRef;
    modelShow() {
      const modal = new bootstrap.Modal(this.modifiedImageModel.nativeElement);
      modal.show();
    }
    modelClose() {
      const modal = bootstrap.Modal.getInstance(this.modifiedImageModel.nativeElement);
      modal?.hide();
    }
    // MODEL PROPERTIES ENDING
    // ============================================================================================
    // =============================================================================




























  // IMAGE PREVIEW STARTING
  imageList: string[] = [];
  selectedImage: string = '';
  currentIndex: number = 0;

  openImageModal(index: number) {
    // Filter only image URLs from productData
    this.imageList = this.productData
      .filter((item:any) => item.fileType === 'IMAGE')
      .map((item:any) => item.fileUrl);

    this.currentIndex = this.imageList.indexOf(
      this.productData[index].fileUrl
    );

    this.selectedImage = this.imageList[this.currentIndex];

    const modalEl = document.getElementById('imagePreviewModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  nextImage() {
    if (this.currentIndex < this.imageList.length - 1) {
      this.currentIndex++;
      this.selectedImage = this.imageList[this.currentIndex];
    }
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.selectedImage = this.imageList[this.currentIndex];
    }
  }
  // IMAGE PREVIEW ENDING

}
