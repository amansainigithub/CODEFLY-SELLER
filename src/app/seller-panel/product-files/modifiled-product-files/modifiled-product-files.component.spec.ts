import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifiledProductFilesComponent } from './modifiled-product-files.component';

describe('ModifiledProductFilesComponent', () => {
  let component: ModifiledProductFilesComponent;
  let fixture: ComponentFixture<ModifiledProductFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifiledProductFilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifiledProductFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
