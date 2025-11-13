import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { ModifiedProductFilesService } from '../../../_services/productFilesService/product-files-service/modified-product-files.service';
declare var bootstrap: any;
@Component({
  selector: 'app-modifiled-product-files',
  templateUrl: './modifiled-product-files.component.html',
  styleUrl: './modifiled-product-files.component.css'
})
export class ModifiledProductFilesComponent {

  productId:any;
  productData:any;

  imageCount:any;
  videoCount:any;

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

        this.imageCount = this.productData.filter((item: any) => item.fileType === 'IMAGE').length;
        this.videoCount = this.productData.filter((item: any) => item.fileType === 'VIDEO').length;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }



// ###########################################################################################################################
// ###########################################################################################################################


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
    @ViewChild('modifiedImageModel') modifiedImageModel!: ElementRef;
    modelShow() {
      const modal = new bootstrap.Modal(this.modifiedImageModel.nativeElement);
      modal.show();
    }
    modelClose() {
      const modal = bootstrap.Modal.getInstance(this.modifiedImageModel.nativeElement);
      modal?.hide();
    }
  // =============================================================================
  // MODEL PROPERTIES ENDING
  




// ###########################################################################################################################
// ###########################################################################################################################






// ===================== VIDEO FILES ===================== //

selectedVideoUrl: string | null = null;
currentVideoFileId: any;
selectedVideoFile: File | null = null;
previewVideoUrl: any = null;
selectedVideoIndex: number | null = null;

videoFormData: any = new FormData();

modifiedVideoFile(index: number) {
  this.selectedVideoIndex = index;
  this.selectedVideoUrl = this.productData[index].fileUrl;
  this.currentVideoFileId = this.productData[index].id;

  this.modelShowVideo();
}

onVideoSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedVideoFile = file;

    const reader = new FileReader();
    reader.onload = (e) => (this.previewVideoUrl = e.target?.result);
    reader.readAsDataURL(file);

    // Append Video to FormData
    this.videoFormData = new FormData(); // reset before appending
    this.videoFormData.append('files', file);

    if (this.currentVideoFileId) {
      this.videoFormData.append('fileId', this.currentVideoFileId);
    }
  }
}

updateVideoFile() {
  if (!this.selectedVideoFile || this.selectedVideoIndex === null) return;

  const user = this.tokenStorageService.getUser();

  this.spinner.show();
  this.modifiedProductFiles
    .modifiedVideoFilesService(this.videoFormData, this.currentVideoFileId, this.productId, user.username)
    .subscribe({
      next: (res: any) => {
        console.log('Video update success:', res);
        this.toast.success({
          detail: 'Success',
          summary: 'Video Update Successful',
          position: 'topRight',
          duration: 2000,
        });
        this.spinner.hide();

        this.getProductFilesById(this.productId);
        window.location.reload();
      },
      error: (err: any) => {
        console.error('Video update failed:', err);
        this.toast.error({
          detail: 'Error',
          summary: 'Video Update Failed',
          position: 'topRight',
          duration: 2000,
        });
        this.spinner.hide();

        window.location.reload();
      },
    });
}

// ===================== VIDEO MODAL PROPERTIES =====================
// ==================================================================  
@ViewChild('modifiedVideoModel') modifiedVideoModel!: ElementRef;

modelShowVideo() {
  const modal = new bootstrap.Modal(this.modifiedVideoModel.nativeElement);
  modal.show();
}

modelCloseVideo() {
  const modal = bootstrap.Modal.getInstance(this.modifiedVideoModel.nativeElement);
  modal?.hide();
}
// ==================================================================  
// ===================== VIDEO MODAL PROPERTIES =====================




// ###########################################################################################################################
// ###########################################################################################################################






// ===================== NEW FILE UPLOAD VARIABLES =====================
newSelectedFile: File | null = null;
newPreviewUrl: any = null;
newSelectedFileType: string | null = null;
newFormData: any = new FormData();

// ===================== NEW FILE UPLOAD METHOD =====================
onNewFileSelected(event: any) {
  
   const productFile = event.target.files[0];
   const fileType = productFile.type.startsWith('video') ? 'VIDEO' : 'IMAGE';


    if(fileType === 'IMAGE' && this.imageCount >= 5)
    {
      this.toast.error({detail:"Error",summary:"You can upload a maximum of 5 images per product.",
      position:"topRight",duration:2000});
      return;
    }

    if(fileType === 'VIDEO' && this.videoCount >= 1)
    {
      this.toast.error({detail:"Error",summary:"You can upload only 1 video per product.",
      position:"topRight",duration:2000});
      return;
    }

  const file = event.target.files[0];
  if (file) {
    this.newSelectedFile = file;
    this.newSelectedFileType = file.type.startsWith('video') ? 'video' : 'image';

    const reader = new FileReader();
    reader.onload = (e) => (this.newPreviewUrl = e.target?.result);
    reader.readAsDataURL(file);

    // RESET FORM DATA & APPEND
    this.newFormData = new FormData();
    this.newFormData.append('files', file);
    if (this.productId) {
      this.newFormData.append('productId', this.productId);
    }
  }
}

// ===================== UPLOAD NEW FILE METHOD =====================
uploadNewFile() {
  if (!this.newSelectedFile) return;

  const user = this.tokenStorageService.getUser();
  this.spinner.show();

  this.modifiedProductFiles.uploadNewFileService(this.newFormData, this.productId, user.username)
    .subscribe({
      next: (res: any) => {
        console.log('Upload success:', res);
        this.toast.success({
          detail: 'Success',
          summary: 'New File Uploaded Successfully',
          position: 'topRight',
          duration: 2000,
        });
        this.spinner.hide();
        this.getProductFilesById(this.productId);
        this.modelNewClose();

        window.location.reload();
      },
      error: (err: any) => {
        console.error('Upload error:', err);
        this.toast.error({
          detail: 'Error',
          summary: 'File Upload Failed',
          position: 'topRight',
          duration: 2000,
        });
        this.spinner.hide();
      },
    });
}

// ===================== MODAL METHODS FOR NEW FILE =====================
@ViewChild('newFileModel') newFileModel!: ElementRef;

modelNewShow() {
  const modal = new bootstrap.Modal(this.newFileModel.nativeElement);
  modal.show();
}

modelNewClose() {
  const modal = bootstrap.Modal.getInstance(this.newFileModel.nativeElement);
  modal?.hide();
}




// ###########################################################################################################################
// ###########################################################################################################################



//REFRESH DATA 
refreshData()
{
  this.getProductFilesById(this.productId);
}




// ###########################################################################################################################
// ###########################################################################################################################




















































// ==================================================================================================================
// ==================================================================================================================
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
// ==================================================================================================================
// ==================================================================================================================
}
