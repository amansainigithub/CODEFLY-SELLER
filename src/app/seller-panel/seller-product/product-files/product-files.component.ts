import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { API_AUTHORIZA_URL } from '../../../constants/Constants';
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

uploadAll() {

  // Check main image slot (index 0)
  if (!this.files[0]) {
    alert("Please upload Main image before submitting!");
    return;
  }

  const formData = new FormData();
  this.files.forEach((file, i) => {
    if (file) {
      formData.append('files', file); // backend pe same field name "files"
    }
  });

  this.categoryService.fileUploadService(formData).subscribe({
    next: (res: any) => {
      alert(res);
    },
    error: (err: any) => {
      alert(err);
    }
  });

  // Agar direct http se upload karna ho to:
  // this.http.post(API_AUTHORIZA_URL+"uploadFiles", formData)
  //   .subscribe(res => {
  //     console.log('Upload success:', res);
  //   });
}




}
