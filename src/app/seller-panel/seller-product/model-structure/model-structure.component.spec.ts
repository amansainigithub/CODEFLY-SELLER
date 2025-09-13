import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelStructureComponent } from './model-structure.component';

describe('ModelStructureComponent', () => {
  let component: ModelStructureComponent;
  let fixture: ComponentFixture<ModelStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelStructureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModelStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
