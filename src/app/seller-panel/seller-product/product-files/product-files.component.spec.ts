import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFilesComponent } from './product-files.component';

describe('ProductFilesComponent', () => {
  let component: ProductFilesComponent;
  let fixture: ComponentFixture<ProductFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductFilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
