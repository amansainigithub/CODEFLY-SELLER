import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductCategoryService } from '../../../_services/productCategory/product-category.service';

@Component({
  selector: 'app-product-files',
  templateUrl: './product-files.component.html',
  styleUrl: './product-files.component.css'
})
export class ProductFilesComponent {

formData:any;
finalCategory:any;

constructor(private router: Router,
            private http: HttpClient,
          private categoryService:ProductCategoryService) {

  const navigation = this.router.getCurrentNavigation();
  const state = navigation?.extras?.state as { formData:any,finalCategory:any };
  
  if (state && state.formData !== undefined && state.formData !== null) {
  this.formData = state.formData;
  } else {
    this.formData = {};
  }

  if (state && state.finalCategory !== undefined && state.finalCategory !== null) {
    this.finalCategory = state.finalCategory;
  } else {
    this.finalCategory = {};
  }

  console.log("==================PRODUCT FILES=====================");
  if(this.validateFormAndCategory())
  {
    console.log("✅ Valid data hai");
    console.log(this.formData);
    console.log(this.finalCategory);
  }else{
    console.log("❌ Invalid data (null/blank/empty)");
    this.router.navigateByUrl("/seller/dashboard/home");
  }
}

ngOnInit(): void {
    // ✅ Component load hone ke 2 second baad sabhi slots + video set hoga
    setTimeout(() => {
      this.setDefaultFiles();
    }, 2000);
  }



//Check Category and Product Form Data is Valid or Not
validateFormAndCategory(): boolean {
  if (
    this.formData && Object.keys(this.formData).length > 0 &&
    this.finalCategory && Object.keys(this.finalCategory).length > 0 &&
    this.finalCategory.vData &&
    this.finalCategory.vData.id !== null &&
    this.finalCategory.vData.id !== undefined &&
    this.finalCategory.vData.id !== ""
  ) {
    return true;
  } else {
    return false;
  }
}





// =====================================================================================================

imageSlots: (string | ArrayBuffer | null)[] = [null, null, null, null, null]; // 5 slots
files: (File | null)[] = [null, null, null, null, null]; // store original files

onFileSelected(event: any, index: number) {
  const fileInput = event.target as HTMLInputElement;
  const file: File | null = fileInput.files ? fileInput.files[0] : null;

  if (file) {
    // Allowed file types
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PNG and JPG/JPEG images are allowed!");
      this.files[index] = null;
      this.imageSlots[index] = null;
      fileInput.value = ''; // reset input
      return;
    }

    // File size check (max 5 MB)
    const maxSize = 1 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      alert("File size must be less than 5 MB!");
      this.files[index] = null;
      this.imageSlots[index] = null;
      fileInput.value = ''; // reset input
      return;
    }

    // ✅ Agar valid hai to slot me set karo
    this.files[index] = file;
    const reader = new FileReader();
    reader.onload = () => this.imageSlots[index] = reader.result;
    reader.readAsDataURL(file);
  }

  // ✅ Same file dobara select kar sake uske liye reset karna zaroori hai
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


// VIDEO UPLOAD=======================================================================

videoUrl: string | null = null;
videoFile: File | null = null;

onVideoSelected(event: any) {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files ? fileInput.files[0] : null;

  if (file) {
    const fileSizeInMB = file.size / (1024 * 1024); 
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension !== 'mp4') {
      alert("Only MP4 format is allowed!");
      fileInput.value = ''; // reset input
      return;
    }
    if (fileSizeInMB < 5) {
      alert("Video size must be at least 5 MB!");
      fileInput.value = ''; // reset input
      return;
    }
    if (fileSizeInMB > 50) {
      alert("Video size must not exceed 50 MB!");
      fileInput.value = ''; // reset input
      return;
    }

    this.videoFile = file;
    this.videoUrl = URL.createObjectURL(file);
  }

  // ✅ Same file dobara upload kar sake iske liye reset karo
  fileInput.value = '';
}


removeVideo(event: MouseEvent) {
  event.stopPropagation();
  this.videoUrl = null;
  this.videoFile = null;
}






submitProduct() {
  // Check main image slot (index 0)
  if (!this.files[0]) {
    alert("Please upload Main image before submitting!");
    return;
  }

  const formData = new FormData();

  // Images append karo
  this.files.forEach((file, i) => {
    if (file) {
      formData.append("files", file); // backend me "files" naam ke field ke sath jayega
    }
  });

  // Video append karo
  if (this.videoFile) {
    formData.append("video", this.videoFile); // backend pe "video" naam se milega
  }

  this.categoryService.fileUploadService(formData).subscribe({
    next: (res: any) => {
      alert(res);
    },
    error: (err: any) => {
      alert(err);
    }
  });
}




setDefaultFiles() {
  const defaultImgUrl = "https://res.cloudinary.com/dgidcgrxs/image/upload/v1744827500/megamart/ProductImages/c1s2axjdbneybvhgyaym.jpg";
  const defaultVideoUrl = "https://res.cloudinary.com/dgidcgrxs/video/upload/v1758027410/5f795368-928f-47d9-a94c-73210bd3f708_eo2o3v.mp4";

  // 🔹 Sabhi slots ke liye default image set karna
  this.imageSlots = [defaultImgUrl, defaultImgUrl, defaultImgUrl, defaultImgUrl, defaultImgUrl];

  // 🔹 Image ko fetch karke File[] me convert karna
  fetch(defaultImgUrl)
    .then(res => res.blob())
    .then(blob => {
      const defaultFile = new File([blob], "default.jpg", { type: blob.type });
      this.files = [defaultFile, defaultFile, defaultFile, defaultFile, defaultFile];
    });

  // 🔹 Video preview ke liye default video URL
  this.videoUrl = defaultVideoUrl;

  // 🔹 Video ko fetch karke File me convert karna
  fetch(defaultVideoUrl)
    .then(res => res.blob())
    .then(blob => {
      this.videoFile = new File([blob], "default.mp4", { type: blob.type });
    });
}





}
