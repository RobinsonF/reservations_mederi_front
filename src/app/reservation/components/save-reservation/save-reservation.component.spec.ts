import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveReservationComponent } from './save-reservation.component';

describe('SaveReservationComponent', () => {
  let component: SaveReservationComponent;
  let fixture: ComponentFixture<SaveReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveReservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
