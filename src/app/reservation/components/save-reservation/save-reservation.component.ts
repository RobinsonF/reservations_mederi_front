import { Component, Inject, OnInit, signal } from '@angular/core';
import { ICreateReservation, IReservation } from '../../../core/models/reservation.model';
import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { RequestStatus } from '../../../core/models/request-status.model';
import { faEye, faEyeSlash, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { ReservationService } from '../../../core/services/reservation.service';
import { IUser } from '../../../core/models/user.model';
import { IRoom } from '../../../core/models/room.model';
import { RoomService } from '../../../core/services/room.service';
import { UserService } from '../../../core/services/user.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface InputData {
  id: number,
  reservation: IReservation,
  user: IUser | null,
}

interface OutputData {
  rta: boolean;
  message: string;
  reservation: IReservation | null;
}

@Component({
  selector: 'app-save-reservation',
  standalone: true,
  imports: [DialogModule, FontAwesomeModule, ReactiveFormsModule, ButtonComponent, ToastModule],
  templateUrl: './save-reservation.component.html',
  styleUrl: './save-reservation.component.scss',
  providers: [MessageService]
})
export class SaveReservationComponent implements OnInit {

  status: RequestStatus = 'init';
  faClose = faWindowClose;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  reservationId: number = 0;
  showPassword = false;
  reservation: IReservation | null = null;
  users = signal<IUser[]>([]);
  rooms = signal<IRoom[]>([]);
  user = signal<IUser | null>(null);
  form!: FormGroup;
  minDate!: string;


  constructor(
    private dialogRef: DialogRef<OutputData>,
    private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private roomService: RoomService,
    private userService: UserService,
    private messageService: MessageService,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    const today = new Date();
    today.setHours(today.getHours() - 5);
    this.minDate = today.toISOString().slice(0, 16);
    if (data.reservation) {
      this.reservationId = data.id;
      this.reservation = data.reservation;
      const startTime = this.reservation.startTime;
      const dateStart = new Date(startTime);
      const endTime = this.reservation.endTime;
      const dateEnd = new Date(endTime);


      dateStart.setHours(dateStart.getHours() - 5);
      dateEnd.setHours(dateEnd.getHours() - 5);

      this.form = this.formBuilder.nonNullable.group({
        roomId: ['', [Validators.required]],
        userId: ['', [Validators.required]],
        startTime: ['', [Validators.required]],
        endTime: ['', [Validators.required]],
        purpose: ['', [Validators.required]]
      }
      );
      this.form.patchValue({
        roomId: this.reservation.roomId.toString(),
        userId: this.reservation.userId.toString(),
        startTime: dateStart.toISOString().slice(0, 16),
        endTime: dateEnd.toISOString().slice(0, 16),
        purpose: this.reservation.purpose
      });
    } else {
      this.form = this.formBuilder.nonNullable.group({
        roomId: ['', [Validators.required]],
        userId: ['', [Validators.required]],
        startTime: ['', [Validators.required]],
        endTime: ['', [Validators.required]],
        purpose: ['', [Validators.required]]
      }
      );
    }
    if (data.user) {
      this.user.set(data.user);
      this.form = this.formBuilder.nonNullable.group({
        roomId: ['', [Validators.required]],
        userId: [''],
        startTime: ['', [Validators.required]],
        endTime: ['', [Validators.required]],
        purpose: ['', [Validators.required]]
      }
      );
      if (data.reservation) {
        this.reservation = data.reservation;
        const startTime = this.reservation.startTime;
        const dateStart = new Date(startTime);

        const endTime = this.reservation.endTime;
        const dateEnd = new Date(endTime);

        dateStart.setHours(dateStart.getHours() - 5);
        dateEnd.setHours(dateEnd.getHours() - 5);

        this.form.patchValue({
          roomId: this.reservation.roomId.toString(),
          userId: this.reservation.userId.toString(),
          startTime: dateStart.toISOString().slice(0, 16),
          endTime: dateEnd.toISOString().slice(0, 16),
          purpose: this.reservation.purpose
        });
      }
    }

  }

  ngOnInit(): void {
    this.roomService.get().subscribe({
      next: (data) => {
        if (data) {
          this.rooms.set(data.data);
        }
      },
      error: (error) => {

      }
    });
    if (!this.user()) {
      this.userService.get().subscribe({
        next: (data) => {
          if (data) {
            this.users.set(data.data);
          }
        },
        error: (error) => {
        }
      })
    }
  }

  onSave() {
    if (this.form.valid) {
      this.status = 'loading';
      const { roomId, userId, startTime, endTime, purpose } = this.form.getRawValue();
      let saveUserId = 0;
      if (this.user()) {
        saveUserId = this.user()?.id || 0;
      } else {
        saveUserId = userId;
      }
      if (!this.reservation) {
        const reservation: ICreateReservation = {
          roomId: parseInt(roomId, 10),
          userId: parseInt(saveUserId.toString(), 10),
          startTime,
          endTime,
          purpose,
          status: 'A',
          active: true,
        }
        this.reservationService.create(reservation).subscribe({
          next: (data) => {
            if (data) {
              this.close(true, 'Reservación creada correctamente', data.data);
            }
          },
          error: (error) => {
            this.status = 'failed';
            this.messageService.add({ severity: 'error', summary: error.error.message, detail: '' });
          }
        })
      } else {
        const reservationUpdate = {
          roomId: parseInt(roomId, 10),
          userId: parseInt(saveUserId.toString(), 10),
          startTime,
          endTime,
          purpose
        }
        this.reservationService.update(this.reservation.id, reservationUpdate).subscribe({
          next: (data) => {
            if (data) {
              this.close(true, 'Reservación actualizada correctamente', data.data);
            }
          },
          error: (error) => {
            this.status = 'failed';
            this.messageService.add({ severity: 'error', summary: error.error.message, detail: '' });
          }
        })
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  close(rta: boolean, message: string, reservation: IReservation | null) {
    this.dialogRef.close({ rta, message, reservation });
  }

}
