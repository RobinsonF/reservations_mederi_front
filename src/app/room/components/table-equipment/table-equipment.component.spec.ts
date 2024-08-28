import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableEquipmentComponent } from './table-equipment.component';

describe('TableEquipmentComponent', () => {
  let component: TableEquipmentComponent;
  let fixture: ComponentFixture<TableEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableEquipmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
