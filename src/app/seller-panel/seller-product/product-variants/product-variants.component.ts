import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EngineXService } from '../../../_services/productUploadService/engineXService/engine-x.service';
import { FormArray,FormBuilder,FormControl,FormGroup, Validators,} from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, Observable, startWith } from 'rxjs';
import { ProductVariantService } from '../../../_services/productUploadService/productVariants/product-variant.service';

declare var bootstrap: any; // Declare bootstrap for accessing modal methods

@Component({
  selector: 'app-product-variants',
  templateUrl: './product-variants.component.html',
  styleUrl: './product-variants.component.css',
})
export class ProductVariantsComponent {
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
  productData: any;

  constructor(
    private engineXService: EngineXService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toast: NgToastService,
    private spinner: NgxSpinnerService,
    private variantService: ProductVariantService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { productData: any };

    this.productData = navigation?.extras.state as {
      productId: any;
      productKey: string;
      variantId: number;
    };

    //Load DYNAMIC FORM USING IN ENGINE-X DATA
    this.categorySelection = { vData: { id: this.productData.variantId } };

    if (state) {
      this.productForm = this.formBuilder.group({
        productSizeRows: this.formBuilder.array([]),
      });

      //Get Engine-X Data--- Form Builder By Engine X Data Dynamically----
      this.getEngineX();

      //LOAD PRODUCT DETAILS DATA
      this.loadProductData();

      // setTimeout(() => {
      //   this.prefillForm();
      // }, 2000);
    } else {
      alert('Product Id Not Found Here...');
      return;
    }
  }

  getEngineX() {
    console.log('Load Engine X Data....');

    this.spinner.show();
    this.engineXService.getEngineX(this.productData.variantId).subscribe(
      (data: any) => {
        this.formfields = data.inventoryData;
        this.productDetails = data.productDetails;
        this.dynamicRows = data.rows;
        this.additionalDetails = data.additionalDetails;

        this.generateDynamicControls(this.formfields);
        this.generateDynamicControls(this.productDetails);
        this.generateDynamicControls(this.additionalDetails);
        // console.log(this.productForm);
        this.spinner.hide();
      },
      (err: any) => {
        console.error(err);
        this.spinner.hide();
      }
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

        // ✅ Only ONE push
        const newRow = this.formBuilder.group(rowGroup);
        this.productSizeRows.push(newRow);

        // Subscribe to MRP and Price fields
        const mrpControl = newRow.get('mrp');
        const priceControl = newRow.get('price');

        if (mrpControl) {
          mrpControl.valueChanges.subscribe((value) => {
            this.updateAllRows('mrp', value, newRow);
          });
        }
        if (priceControl) {
          priceControl.valueChanges.subscribe((value) => {
            this.updateAllRows('price', value, newRow);
          });
        }
      }
    });

    this.hasMultiSelectValues = this.productSizeRows.length > 0;
  }

  // 🔑 propagate same value to all rows
  updateAllRows(fieldName: string, value: any, sourceRow: FormGroup) {
    this.productSizeRows.controls.forEach((row: any) => {
      if (row !== sourceRow) {
        row.get(fieldName)?.setValue(value, { emitEvent: false });
      }
    });
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
      row.get('price')?.setErrors({ greater: true });
    } else {
      if (row.get('price')?.hasError('greater')) {
        row.get('price')?.setErrors(null);
      }
    }
  }

  //================CALCULATED GST, TCS TDS AMOUNT STARTING=================
  actualPrice: any;
  mrpValue: any;
  gstAmount: any;
  tcsAmount: any;
  tdsAmount: any;
  bankSettlementAmount: any;
  shippingCharges: any = 70.0;
  finalSettlementAmount: any;

  onPriceChange(rowIndex: number): void {
    if (rowIndex === 0) {
      this.actualPrice = 0;
    }

    // Reset total
    this.actualPrice = 0;

    // Calculate actualPrice and mrpValue
    this.productForm.value.productSizeRows.forEach((row: any) => {
      this.actualPrice = parseFloat(row.price || 0);
      this.mrpValue = parseFloat(row.mrp || 0);
    });

    const gstPercentage = parseFloat(this.productForm.value.gst || 0);

    if (gstPercentage > 0) {
      // GST, TCS, TDS
      this.gstAmount = this.calculateGST(this.actualPrice, gstPercentage);
      this.tcsAmount = this.calculateTCS(this.actualPrice, gstPercentage);
      this.tdsAmount = this.calculateTDS(this.actualPrice);

      console.log('GST :: ' + this.gstAmount);
      console.log('tcsAmount :: ' + this.tcsAmount);
      console.log('tdsAmount :: ' + this.tdsAmount);
      console.log('actualPrice :: ' + this.actualPrice);

      // Bank Settlement
      this.bankSettlementAmount =
        Number(this.actualPrice || 0) -
        (Number(this.gstAmount || 0) +
          Number(this.tcsAmount || 0) +
          Number(this.tdsAmount || 0));
      console.log('bankSettlementAmount :: ' + this.bankSettlementAmount);

      // Final Settlement
      this.finalSettlementAmount = this.finalSettlement(
        this.bankSettlementAmount,
        this.shippingCharges
      );
    } else {
      return;
    }
  }

  onGstChange(data: any) {
    console.log(data);
    //Change Price
    this.onPriceChange(0);
  }

  // GST CALCULATION
  calculateGST(price: number, gstPercentage: any): string {
    gstPercentage = parseFloat(gstPercentage);
    return this.roundToTwo((price * gstPercentage) / 100);
  }

  // TCS CALCULATION
  calculateTCS(price: number, gstPercentage: string | number): string {
    const gstAmount = parseFloat(this.calculateGST(price, gstPercentage));
    const totalPrice = price + gstAmount;
    const tcsRate = 1; // TCS rate in percentage
    return this.roundToTwo((totalPrice * tcsRate) / 100);
  }

  // TDS CALCULATION
  calculateTDS(price: number): string {
    const tdsRate = 1;
    return this.roundToTwo((price * tdsRate) / 100);
  }

  // Bank Settlement
  bankSettlement(
    actualPrice: number,
    gstAmount: string,
    tcsAmount: string,
    tdsAmount: string
  ): string {
    return this.roundToTwo(
      actualPrice -
        (parseFloat(gstAmount) + parseFloat(tcsAmount) + parseFloat(tdsAmount))
    );
  }

  // Final Settlement
  finalSettlement(bankSettlementAmount: string,shippingCharges: string): string {
    return this.roundToTwo(parseFloat(bankSettlementAmount) + parseFloat(shippingCharges));
  }

  // Utility method to round numbers to two decimal places
  roundToTwo(value: number): string {
    return value.toFixed(2); // returns "9.80" instead of "9.8"
  }

  //================CALCULATED GST, TCS TDS AMOUNT ENDING=================

  //SUBMIT DATA
  onSubmit() {
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
    } else {
      this.productProceedModelShow();
    }
  }

  // PLRODUCT PROCCEED
  proceedWithProduct() {
    console.log(this.productData);
    
    this.spinner.show();
    setTimeout(() => {
      if (
        this.productForm.value &&
        Object.keys(this.productForm.value).length > 0 &&
        this.productData.variantId !== null
      ) {
        this.router.navigate(['/seller/dashboard/home/productVariantFiles'], {
          state: {
            formData: this.productForm.value,
            finalCategory: this.productData.variantId,
            productId:this.productData.productId
          },
        });

        //Spinner Close
        this.spinner.hide();

        //Close Model
        this.proceedModelClose();
      } else {
        this.toast.error({
          detail: 'Something went Wrong Please try again after some time!',
          summary: 'Error',
          position: 'bottomRight',
          duration: 2000,
        });
      }
    }, 2000);
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











  // PRODUCT DETAILS LOAD DATA STARTING
  loadData: any;
  loadProductData() {
    this.spinner.show();
    this.variantService
      .loadProductDetails(this.productData.productId)
      .subscribe({
        next: (res: any) => {

          this.actualPrice = res.data.productPrice;
          this.gstAmount = res.data.productGst;
          this.tcsAmount = res.data.productTcs;
          this.tdsAmount = res.data.productTds;
          this.bankSettlementAmount = res.data.bankSettlementAmount;
          this.finalSettlementAmount = this.roundToTwo(parseFloat(this.bankSettlementAmount) + parseFloat(this.shippingCharges));

          //Load Data
          this.loadData = res.data;

          // 1. Patch simple fields
          this.productForm.patchValue(this.loadData);

          // 2. Clear old table rows
          const formArray = this.productForm.get(
            'productSizeRows'
          ) as FormArray;
          formArray.clear();

          // 3. Create table rows with filter setup
          this.loadData.productSizeRows.forEach((rowData: any) => {
            const rowGroup: { [key: string]: FormControl } = {};

            this.dynamicRows.forEach((col) => {
              const control = new FormControl(
                rowData[col.identifier] || '',
                col.required ? [Validators.required] : []
              );
              rowGroup[col.identifier] = control;

              if (col.type === 'DROPDOWN') {
                this.filteredTableDropdowns[
                  `${col.identifier}_${rowData.__msVal}`
                ] = control.valueChanges.pipe(
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

          this.spinner.hide();
        },
        error: (err: any) => {
          console.log(err);
          this.spinner.hide();
        },
      });
  }
  // PRODUCT DETAILS LOAD DATA ENDING.....





















  // ========================PREFILL DATA STARTING=======================
  prefillForm() {
    const testData = {
      productSizeRows: [
        {
          mrp: '150',
          price: '140',
          inventory: '100',
          skuCode: '150',
          chestSize: '22',
          lengthSize: '20',
          shoulderSize: '22',
          __msId: 'productSizes',
          __msVal: 'LX',
        },
        {
          mrp: '150',
          price: '140',
          inventory: '100',
          skuCode: '888',
          chestSize: '28',
          lengthSize: '25',
          shoulderSize: '24',
          __msId: 'productSizes',
          __msVal: '10XL',
        },
        {
          mrp: '150',
          price: '140',
          inventory: '100',
          skuCode: '456',
          chestSize: '32',
          lengthSize: '24',
          shoulderSize: '42',
          __msId: 'productSizes',
          __msVal: 'M',
        },
        {
          mrp: '150',
          price: '140',
          inventory: '100',
          skuCode: '777',
          chestSize: '34',
          lengthSize: '29',
          shoulderSize: '48',
          __msId: 'productSizes',
          __msVal: '7XL',
        },
        {
          mrp: '150',
          price: '140',
          inventory: '100',
          skuCode: '150',
          chestSize: '38',
          lengthSize: '24',
          shoulderSize: '30',
          __msId: 'productSizes',
          __msVal: 'Free Size',
        },
      ],
      productName:
        'Hair Bands Women| Girls | Kids | 24 Pieces Multicolor Elastic Hair Bands H',
      defaultName: 'Mens Clothing',
      gst: '18',
      hsnCode: '44045',
      netWeight: '10',
      productSizes: ['M', '7XL', '10XL', 'LX', 'Free Size'],
      color: 'Crimson',
      netQuantity: '2',
      neck: 'V-Neck',
      occasion: 'Party',
      pattern: 'Floral',
      sleeveLength: 'Full Sleeve / Long Sleeve',
      countryOfOrigin: 'INDIA',
      manufacturerName: 'Saurav ',
      manufacturerAddress: 'H/82414 Mata gadh near shiv mandir',
      manufacturerPincode: '120120',
      brand: 'neha 1111',
      lining: 'Detachable Lining',
      closureType: 'Drawstring',
      stretchType: 'Low Stretch',
      careInstruction: 'Do Not Bleach',
      description: 'coding company',
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
  // ========================PREFILL DATA ENDING=======================.-
}
