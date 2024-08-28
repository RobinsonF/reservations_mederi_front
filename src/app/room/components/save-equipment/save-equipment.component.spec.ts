import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveEquipmentComponent } from './save-equipment.component';

describe('SaveEquipmentComponent', () => {
  let component: SaveEquipmentComponent;
  let fixture: ComponentFixture<SaveEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveEquipmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
