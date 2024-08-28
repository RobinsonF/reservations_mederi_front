import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveRoomComponent } from './save-room.component';

describe('SaveRoomComponent', () => {
  let component: SaveRoomComponent;
  let fixture: ComponentFixture<SaveRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
