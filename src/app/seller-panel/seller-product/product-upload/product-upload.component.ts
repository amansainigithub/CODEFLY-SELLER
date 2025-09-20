import { Component, ElementRef, ViewChild } from '@angular/core';
import {FormArray,FormBuilder,FormControl,FormGroup,Validators,} from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SharedDataService } from '../../../_services/sharedService/shared-data.service';
import { Router } from '@angular/router';
import { EngineXService } from '../../../_services/productUploadService/engineXService/engine-x.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';

declare var bootstrap: any; // Declare bootstrap for accessing modal methods

@Component({
  selector: 'app-product-upload',
  templateUrl: './product-upload.component.html',
  styleUrl: './product-upload.component.css',
})
export class ProductUploadComponent {
  productForm!: FormGroup;
  formfields: any[] = [];
  productDetails: any[] = [];
  dynamicRows: any[] = [];
  additionalDetails: any[] = [];
  filteredDropdowns: { [key: string]: Observable<string[]> } = {};

  //Variant Category Selected Data
  categorySelection: any;

  //Progress Bar
  progressBar: any = false;

  constructor(
    private engineXService: EngineXService,
    private formBuilder: FormBuilder,
    private sharedService: SharedDataService,
    private router: Router,
    private toast: NgToastService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    //[Variant Category Data]
    this.categorySelection = this.sharedService.getData();

    if (
      this.categorySelection === undefined ||
      this.categorySelection === null ||
      this.categorySelection === ''
    ) {
      //this.router.navigateByUrl('/seller/dashboard/home');
    }

    this.productForm = this.formBuilder.group({
      productSizeRows: this.formBuilder.array([]),
    });

    //Get Engine-X Data--- Form Builder By Engine X Data Dynamically----
    this.getEngineX();

    setTimeout(() => {
      this.prefillForm();
    }, 2000);
  }

  getEngineX() {
    this.engineXService.getEngineX().subscribe(
      (data: any) => {
        this.formfields = data.inventoryData;
        this.productDetails = data.productDetails;
        this.dynamicRows = data.rows;
        this.additionalDetails = data.additionalDetails;

        this.generateDynamicControls(this.formfields);
        this.generateDynamicControls(this.productDetails);
        this.generateDynamicControls(this.additionalDetails);
        // console.log(this.productForm);
      },
      (err: any) => console.error(err)
    );
  }

  generateDynamicControls(dataReceiver: any[]) {
    dataReceiver.forEach((formKeys) => {
      const validators: any[] = [];
      if (formKeys.required) validators.push(Validators.required);
      if (
        formKeys.minLength !== undefined &&
        formKeys.minLength !== null &&
        formKeys.minLength !== ''
      ) {
        validators.push(Validators.minLength(Number(formKeys.minLength)));
      }
      if (
        formKeys.maxLength !== undefined &&
        formKeys.maxLength !== null &&
        formKeys.maxLength !== ''
      ) {
        validators.push(Validators.maxLength(Number(formKeys.maxLength)));
      }
      if (
        formKeys.max !== undefined &&
        formKeys.max !== null &&
        formKeys.max !== ''
      ) {
        validators.push(Validators.max(Number(formKeys.max)));
      }
      if (
        formKeys.min !== undefined &&
        formKeys.min !== null &&
        formKeys.min !== ''
      ) {
        validators.push(Validators.min(Number(formKeys.min)));
      }
      if (formKeys.pattern) {
        console.log('pattern' + formKeys.pattern);
        validators.push(Validators.pattern(formKeys.pattern));
      }

      this.productForm.addControl(
        formKeys.identifier,
        new FormControl('', validators)
      );

      // Main form dropdown filtering
      if (formKeys.type === 'DROPDOWN') {
        this.filteredDropdowns[formKeys.identifier] = this.productForm
          .get(formKeys.identifier)!
          .valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value || '', formKeys.values))
          );
      }
    });
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  validateDropdownValue(field: any) {
    const value = this.productForm.get(field.identifier)?.value;
    const dropdownValues = field.values;
    if (!dropdownValues.includes(value)) {
      this.productForm.get(field.identifier)?.setValue('');
    }
  }

  onDropdownSelect(event: any, field: any) {
    this.productForm.get(field.identifier)?.setValue(event.option.value);
  }

  //Multi Dropdown
  get productSizeRows(): FormArray {
    return this.productForm.get('productSizeRows') as FormArray;
  }

  hasMultiSelectValues = false;
  filteredTableDropdowns: { [key: string]: Observable<string[]> } = {};
  onMultiSelectChange(event: any, field: any) {
    const selectedValues: string[] = event.value || [];
    this.hasMultiSelectValues =
      this.productSizeRows.length > 0 || selectedValues.length > 0;

    // Remove unselected rows
    for (let i = this.productSizeRows.length - 1; i >= 0; i--) {
      const row = this.productSizeRows.at(i) as FormGroup;
      if (
        row.get('__msId')?.value === field.identifier &&
        !selectedValues.includes(row.get('__msVal')?.value)
      ) {
        this.productSizeRows.removeAt(i);
      }
    }
    // Add new rows
    selectedValues.forEach((val) => {
      const exists = this.productSizeRows.controls.some(
        (ctrl) =>
          ctrl.get('__msId')?.value === field.identifier &&
          ctrl.get('__msVal')?.value === val
      );

      if (!exists) {
        const rowGroup: { [key: string]: FormControl } = {};

        this.dynamicRows.forEach((col) => {
          const validators = [];
          if (col.required) validators.push(Validators.required);
          if (col.minLength)
            validators.push(Validators.minLength(+col.minLength));
          if (col.min) validators.push(Validators.min(Number(col.min)));
          if (col.max) validators.push(Validators.max(Number(col.max)));

          rowGroup[col.identifier] = new FormControl('', validators);

          // Table dropdown filter setup
          if (col.type === 'DROPDOWN') {
            const control = rowGroup[col.identifier];
            this.filteredTableDropdowns[`${col.identifier}_${val}`] =
              control.valueChanges.pipe(
                startWith(''),
                map((value) => this._filter(value || '', col.values))
              );
          }
        });

        rowGroup['__msId'] = new FormControl(field.identifier);
        rowGroup['__msVal'] = new FormControl(val);

        this.productSizeRows.push(this.formBuilder.group(rowGroup));
      }
    });
    this.hasMultiSelectValues = this.productSizeRows.length > 0;
  }

  // REMOVE TABLE ROWS
  removeTableRow(index: number) {
    const row = this.productSizeRows.at(index) as FormGroup;
    if (!row) return;

    const msId = row.get('__msId')?.value;
    const msVal = row.get('__msVal')?.value;
    this.productSizeRows.removeAt(index);

    if (msId) {
      const msCtrl = this.productForm.get(msId);
      if (msCtrl) {
        const currentValues = msCtrl.value || [];
        const updatedValues = currentValues.filter((v: string) => v !== msVal);
        msCtrl.setValue(updatedValues);
        msCtrl.updateValueAndValidity({ emitEvent: true });
      }
    }
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  checkRowPrice(row: any) {
    const mrp = Number(row.get('mrp')?.value);
    const price = Number(row.get('price')?.value);

    if (!isNaN(mrp) && !isNaN(price) && price > mrp) {
      row.get('mrp')?.setErrors({ greater: true });
    } else {
      if (row.get('mrp')?.hasError('greater')) {
        row.get('mrp')?.setErrors(null);
      }
    }
  }

  //SUBMIT AND PREFILL DATA
  onSubmit() {
    console.log('FORM SUBMITTED');
    console.log(this.productForm);

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.toast.error({
        detail: 'Please fill all required fields',
        summary: 'Error',
        position: 'bottomRight',
        duration: 2000,
      });
      return;
    }

    //Show Models
    this.productProceedModelShow();

    // alert('Form Submitted Successfully!');
    // console.log(this.productForm.value);
    // this.router.navigate(['/seller/dashboard/home/productFiles'], {
    //   state: {
    //     formData: this.productForm.value,
    //     finalCategory: this.categorySelection,
    //   },
    // });
  }

  proceedWithProduct() {
    this.spinner.show();

    setTimeout(() => {
      if (
        this.productForm.value &&
        Object.keys(this.productForm.value).length > 0 &&
        this.categorySelection !== null
      ) {
        this.router.navigate(['/seller/dashboard/home/productFiles'], {
          state: {
            formData: this.productForm.value,
            finalCategory: this.categorySelection,
          },
        });

        //Spinner Close
        this.spinner.hide();

        //Close Model
        this.proceedModelClose();
      } else {
        this.toast.error({detail:"Please Enter a Valid mobile number",summary:"Error", position:"bottomRight",duration:2000});
      }
    }, 3000);
  }



















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

  prefillForm() {
    const testData = {
      productSizeRows: [
        {
          price: '456',
          mrp: '600',
          inventory: '100',
          skuCode: '150',
          chestSize: '22',
          lengthSize: '20',
          shoulderSize: '22',
          __msId: 'productSizes',
          __msVal: 'XXS',
        },
        {
          price: '122',
          mrp: '200',
          inventory: '150',
          skuCode: '1500',
          chestSize: '28',
          lengthSize: '23',
          shoulderSize: '24',
          __msId: 'productSizes',
          __msVal: 'S',
        },
        {
          price: '111',
          mrp: '2222',
          inventory: '111',
          skuCode: '150',
          chestSize: '28',
          lengthSize: '23',
          shoulderSize: '24',
          __msId: 'productSizes',
          __msVal: 'M',
        },
        {
          price: '5555',
          mrp: '6666',
          inventory: '888',
          skuCode: '150',
          chestSize: '28',
          lengthSize: '28',
          shoulderSize: '24',
          __msId: 'productSizes',
          __msVal: '10XL',
        },
        {
          price: '900',
          mrp: '8000',
          inventory: '1000',
          skuCode: '150',
          chestSize: '32',
          lengthSize: '25',
          shoulderSize: '34',
          __msId: 'productSizes',
          __msVal: '7XL',
        },
      ],
      productName:
        'Hair Bands Women| Girls | Kids | 24 Pieces Multicolor Elastic Hair Bands H',
      defaultName: 'Mens Clothing',
      gst: '15',
      hsnCode: '44045',
      netWeight: '10',
      productSizes: ['XXS', 'S', 'M', '7XL', '10XL'],
      color: 'RoyalBlue',
      netQuantity: '4',
      neck: 'Polo Collar / Collar Neck',
      occasion: 'Sports / Activewear',
      pattern: 'Geometric',
      sleeveLength: 'Elbow Length',
      countryOfOrigin: 'INDIA',
      manufacturerName: 'Saurav ',
      manufacturerAddress: 'H/82414 Mata gadh near shiv mandir',
      manufacturerPincode: '120120',
      brand: 'A23 Lifestyle',
      lining: 'Attached Lining',
      closureType: 'Slip-On / Pull-On',
      stretchType: 'Medium Stretch',
      careInstruction: 'Tumble Dry Low',
      description: 'software company name',
    };

    // 1. Patch simple fields
    this.productForm.patchValue(testData);

    // 2. Clear old table rows
    const formArray = this.productForm.get('productSizeRows') as FormArray;
    formArray.clear();

    // 3. Create table rows with filter setup
    testData.productSizeRows.forEach((rowData: any) => {
      const rowGroup: { [key: string]: FormControl } = {};

      this.dynamicRows.forEach((col) => {
        const control = new FormControl(
          rowData[col.identifier] || '',
          col.required ? [Validators.required] : []
        );
        rowGroup[col.identifier] = control;

        if (col.type === 'DROPDOWN') {
          this.filteredTableDropdowns[`${col.identifier}_${rowData.__msVal}`] =
            control.valueChanges.pipe(
              startWith(rowData[col.identifier] || ''),
              map((value) => this._filter(value || '', col.values))
            );
        }
      });

      rowGroup['__msId'] = new FormControl(rowData.__msId);
      rowGroup['__msVal'] = new FormControl(rowData.__msVal);

      formArray.push(this.formBuilder.group(rowGroup));
    });

    // 4. Show table
    this.hasMultiSelectValues = formArray.length > 0;
  }
}
