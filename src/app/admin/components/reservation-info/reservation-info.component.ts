import { Component, Inject, OnInit, signal } from '@angular/core';
import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReservationService } from '../../../core/services/reservation.service';
import { IFindAllReservation } from '../../../core/models/reservation.model';

interface InputData {
  id: number
}

interface OutputData {
  rta: boolean;
}

@Component({
  selector: 'app-reservation-info',
  standalone: true,
  imports: [DialogModule, DatePipe, FontAwesomeModule],
  templateUrl: './reservation-info.component.html',
  styleUrl: './reservation-info.component.scss'
})
export class ReservationInfoComponent implements OnInit {

  faClose = faWindowClose;
  reservationId: number = 0;
  reservation = signal<IFindAllReservation | null>(null);

  constructor(
    private dialogRef: DialogRef<OutputData>,
    private reservationService: ReservationService,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    if (data) {
      this.reservationId = data.id;
    }
  }

  ngOnInit(): void {
    this.reservationService.getById(this.reservationId).subscribe({
      next: (data) => {
        this.reservation.set(data.data);
        console.log(this.reservation())
      },
      error: (error) => {

      }
    })
  }

  close() {
    this.dialogRef.close();
  }

}
