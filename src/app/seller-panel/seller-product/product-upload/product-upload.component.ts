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

  constructor(
    private productUploadService: ProductUploadService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      tableRows: this.formBuilder.array([]),
    });

    this.productUploadService.getFormBuilder().subscribe(
      (data: any) => {
        console.log('API Data');
        console.log(data);
        console.log('=============================');

        this.formfields = data.inventoryData;
        this.productDetails = data.productDetails;
        this.dynamicRows = data.rows;
        this.additionalDetails = data.additionalDetails;

        this.generateDynamicControls(this.formfields);
        this.generateDynamicControls(this.productDetails);
        this.generateDynamicControls(this.additionalDetails);
        console.log('Product Form Data');
        console.log(this.productForm);
      },
      (err: any) => console.error(err)
    );

    //     setTimeout(() => {
    //   this.prefillForm();
    // }, 3000);
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
  }

  prefillForm() {
    const testData = {
  tableRows: [
    {
      price: '100',
      MRP: '200',
      inventory: '500',
      SKUID: '',
      chestSize: '22',
      lengthSize: '20',
      shoulderSize: '20',
      __msId: 'brandNames',
      __msVal: 'XXS'
    },
    {
      price: '4500',
      MRP: '6000',
      inventory: '1000',
      SKUID: '900',
      chestSize: '20',
      lengthSize: '25',
      shoulderSize: '30',
      __msId: 'brandNames',
      __msVal: 'XS'
    },
    {
      price: '450',
      MRP: '500',
      inventory: '150',
      SKUID: '12000',
      chestSize: '24',
      lengthSize: '21',
      shoulderSize: '46',
      __msId: 'brandNames',
      __msVal: 'M'
    }
  ],
  'Product Name': 'Aman Saini',
  'Default Name': 'SAini',
  GST: '10',
  'HSN Code': '15023',
  netWeight: '10',
  brandNames: ['XXS', 'XS', 'M'],
  Color: 'Crimson',
  netQuantity: '1',
  neck: 'Turtle Neck / High Neck',
  occasion: 'Formal',
  pattern: 'Sleeveless',
  countryOfOrigin: 'INDIA',
  manufacturerName: 'Saurav',
  manufacturerAddress: 'H/82414 Mata gadh near shiv mandir',
  manufacturerPincode: '247001'
};

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
