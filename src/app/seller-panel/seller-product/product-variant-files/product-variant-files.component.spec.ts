import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVariantFilesComponent } from './product-variant-files.component';

describe('ProductVariantFilesComponent', () => {
  let component: ProductVariantFilesComponent;
  let fixture: ComponentFixture<ProductVariantFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductVariantFilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductVariantFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
