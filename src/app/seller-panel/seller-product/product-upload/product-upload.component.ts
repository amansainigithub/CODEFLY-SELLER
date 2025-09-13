import { Component } from '@angular/core';
import { ProductUploadService } from '../../../_services/productUploadService/productUpload/product-upload.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SharedDataService } from '../../../_services/sharedService/shared-data.service';
import { Router } from '@angular/router';

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
  categorySelection:any;


  constructor(
    private productUploadService: ProductUploadService,
    private formBuilder: FormBuilder,
    private sharedService:SharedDataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    
    //Selected Category [Variant Category]
     this.categorySelection = this.sharedService.getData();

     if(this.categorySelection === undefined || this.categorySelection === null || this.categorySelection === ""){
        this.router.navigateByUrl("/seller/dashboard/home");
      }


    this.productForm = this.formBuilder.group({
      tableRows: this.formBuilder.array([]),
    });

    this.productUploadService.getFormBuilder().subscribe(
      (data: any) => {
        // console.log(data);
        // console.log('=============================');

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

        setTimeout(() => {
      this.prefillForm();
    }, 3000);
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
  get tableRows(): FormArray {
    return this.productForm.get('tableRows') as FormArray;
  }

  hasMultiSelectValues = false;
  filteredTableDropdowns: { [key: string]: Observable<string[]> } = {};
  onMultiSelectChange(event: any, field: any) {
    const selectedValues: string[] = event.value || [];
    this.hasMultiSelectValues =
      this.tableRows.length > 0 || selectedValues.length > 0;

    // Remove unselected rows
    for (let i = this.tableRows.length - 1; i >= 0; i--) {
      const row = this.tableRows.at(i) as FormGroup;
      if (
        row.get('__msId')?.value === field.identifier &&
        !selectedValues.includes(row.get('__msVal')?.value)
      ) {
        this.tableRows.removeAt(i);
      }
    }
    // Add new rows
    selectedValues.forEach((val) => {
      const exists = this.tableRows.controls.some(
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

        this.tableRows.push(this.formBuilder.group(rowGroup));
      }
    });
    this.hasMultiSelectValues = this.tableRows.length > 0;
  }

  // REMOVE TABLE ROWS
  removeTableRow(index: number) {
    const row = this.tableRows.at(index) as FormGroup;
    if (!row) return;

    const msId = row.get('__msId')?.value;
    const msVal = row.get('__msVal')?.value;
    this.tableRows.removeAt(index);

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
  const mrp = Number(row.get('MRP')?.value);
  const price = Number(row.get('price')?.value);

  if (!isNaN(mrp) && !isNaN(price) && price > mrp) {
    row.get('MRP')?.setErrors({ greater: true });
  } else {
    if (row.get('MRP')?.hasError('greater')) {
      row.get('MRP')?.setErrors(null);
    }
  }


}


// checkRowPrice(row: any, field: string) {
//   const value = Number(row.get(field)?.value);

//   // ✅ Price / MRP ko sabhi rows me update karna
//   if (field === 'price' || field === 'MRP') {
//     this.tableRows.controls.forEach((r: any) => {
//       r.get(field)?.setValue(value, { emitEvent: false });
//     });
//   }

//   // ✅ Validation: Price should not be greater than MRP
//   const mrp = Number(row.get('MRP')?.value);
//   const price = Number(row.get('price')?.value);

//   if (!isNaN(mrp) && !isNaN(price) && price > mrp) {
//     row.get('MRP')?.setErrors({ greater: true });
//   } else {
//     if (row.get('MRP')?.hasError('greater')) {
//       row.get('MRP')?.setErrors(null);
//     }
//   }
// }












  
  //SUBMIT AND PREFILL DATA
  onSubmit() {
    console.log('FORM SUBMITTED');
    console.log(this.productForm);

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      alert('Please fill all required fields');
      return;
    }
    alert('Form Submitted Successfully!');
    console.log(this.productForm.value);
    this.router.navigate(['/seller/dashboard/home/productFiles'],
      { state: { formData: this.productForm.value,finalCategory: this.categorySelection } });
  }

  prefillForm() {
    const testData = {
    tableRows: [
        {price: '100', MRP: '200', inventory: '100', SKUID: '100', chestSize: '20', lengthSize: '21', shoulderSize: '22', __msId: 'brandNames', __msVal: 'L'},
        {price: '250', MRP: '250', inventory: '10', SKUID: '100', chestSize: '34', lengthSize: '25', shoulderSize: '24', __msId: 'brandNames', __msVal: '4XL'},
        {price: '2500', MRP: '3000', inventory: '150', SKUID: '100', chestSize: '28', lengthSize: '25', shoulderSize: '30', __msId: 'brandNames', __msVal: 'XXXL'},
        {price: '780', MRP: '1000', inventory: '130', SKUID: '100', chestSize: '22', lengthSize: '21', shoulderSize: '46', __msId: 'brandNames', __msVal: 'XXL'},
        {price: '999', MRP: '1000', inventory: '1200', SKUID: '160', chestSize: '22', lengthSize: '29', shoulderSize: '32', __msId: 'brandNames', __msVal: 'XL'}
    ],
    productName: 'Hair Bands Women| Girls | Kids | 24 Pieces Multicolor Elastic Hair Bands H',
    defaultName: 'Mens Clothing',
    GST: '18',
    hsnCode: '44045',
    netWeight: '200',
    brandNames: ['L', 'XL', 'XXL', 'XXXL', '4XL'],
    color: 'SlateBlue',
    netQuantity: '1',
    neck: 'V-Neck',
    occasion: 'Casual',
    pattern: 'Floral',
    sleeveLength: 'Sleeveless',
    countryOfOrigin: 'INDIA',
    manufacturerName: 'Saurav ',
    manufacturerAddress: 'H/82414 Mata gadh near shiv mandir',
    manufacturerPincode: '120120',
    brand: 'Brand 1',
    lining: 'Inner Slip Included',
    closureType: 'Slip-On / Pull-On',
    stretchType: 'Medium Stretch',
    careInstruction: 'Tumble Dry Low',
    description: 'ecommerce website names'
}


    // 1. Patch simple fields
    this.productForm.patchValue(testData);

    // 2. Clear old table rows
    const formArray = this.productForm.get('tableRows') as FormArray;
    formArray.clear();

    // 3. Create table rows with filter setup
    testData.tableRows.forEach((rowData: any) => {
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
