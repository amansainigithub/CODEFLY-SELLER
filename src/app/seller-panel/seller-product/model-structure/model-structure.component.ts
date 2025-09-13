import { Component, ElementRef, ViewChild } from '@angular/core';


declare var bootstrap: any; // Declare bootstrap for accessing modal methods


@Component({
  selector: 'app-model-structure',
  templateUrl: './model-structure.component.html',
  styleUrl: './model-structure.component.css'
})
export class ModelStructureComponent {


        //Open Model When Catalog Upload Success Working only Once Time Starting
    openModal(): void {
      const modalElement = document.getElementById('myModal');
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Show the modal programmatically
    }
    //Open Model Ending
  
     // Close model Ending
     closeModal(): void {
      const modalElement = document.getElementById('myModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide(); // Hide the modal programmatically
    }
    //Open Model When Catalog Upload Success Working only Once Time Ending











  progressBar:any =false;

    // ===================================================================================
        @ViewChild('proceedModel') proceedModel!: ElementRef;
        productProceedModelShow() {
            const modal = new bootstrap.Modal(this.proceedModel.nativeElement);
            modal.show();
        }
        proceedModelClose() {
          const modal = bootstrap.Modal.getInstance(this.proceedModel.nativeElement);
          modal?.hide();
        }

}
