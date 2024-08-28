import { Component, Input, signal, ViewChild } from '@angular/core';
import { IReservation } from '../../../core/models/reservation.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { faEllipsisH, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '../../../core/services/notification.service';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { UserService } from '../../../core/services/user.service';
import { SaveReservationComponent } from '../save-reservation/save-reservation.component';
import { DeleteComponent } from '../../../shared/components/delete/delete.component';
import { DatePipe } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IUser } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { ReservationService } from '../../../core/services/reservation.service';

@Component({
  selector: 'app-reservation-user',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule,
    MatSortModule, DialogModule, OverlayModule, FontAwesomeModule, DatePipe],
  templateUrl: './reservation-user.component.html',
  styleUrl: './reservation-user.component.scss',
  providers: [NotificationService]
})
export class ReservationUserComponent {

  displayedColumns: string[] = ['date', 'purpose', 'status', 'room', 'createdAt', 'actions'];
  reservations = signal<IReservation[]>([]);
  dataSource = new MatTableDataSource<IReservation>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  faEllipsisV = faEllipsisV;
  faEllipsisH = faEllipsisH;
  user = signal<IUser | null>(null);

  constructor(
    private userService: UserService,
    private reservationService: ReservationService,
    private dialog: Dialog,
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(data => {
      if (data) {
        this.userService.getById(data.id).subscribe({
          next: (data) => {
            this.user.set(data.data);
            this.loadInfo(data.data.reservations);
          },
          error: (error) => {

          }
        })
      }
    })
  }

  loadInfo(reservations: IReservation[]) {
    this.reservations.set(reservations);
    this.dataSource.data = this.reservations();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onCreate() {
    this.dialog.open<any>(SaveReservationComponent, {
      data: {
        id: null,
        reservation: null,
        user: this.user()
      }
    }).closed.subscribe(data => {
      if (data.rta) {
        const reservations = this.reservations();
        if (data.reservation) {
          reservations.push(data.reservation);
          this.loadInfo(reservations);
          this.notificationService.showSuccess('Reservación creada', data.message);
        }
      }
    })
  }

  onUpdate(element: any) {
    delete element.isOpen;
    this.dialog.open<any>(SaveReservationComponent, {
      data: {
        id: element.id,
        reservation: element,
        user: this.user()
      }
    }).closed.subscribe(data => {
      if (data.rta) {
        const reservations = this.reservations();
        if (data.reservation) {
          const index = reservations.findIndex(item => item.id === data.reservation.id);
          if (index !== -1) {
            reservations[index] = {
              ...data.reservation
            }
            this.loadInfo(reservations);
            this.notificationService.showSuccess('Reservación actualizada', data.message);
          }
        }
      }
    })
  }

  onDelete(id: number) {
    this.dialog.open<any>(DeleteComponent, {
      data: {
        title: '¿Estás seguro que quieres cancelar a esta reservación?',
        messageButton: 'Cancelar reservación'
      }
    }).closed.subscribe(data => {
      if (data.rta) {
        this.reservationService.update(id, { status: 'C' }).subscribe({
          next: (data) => {
            if (data) {
              const reservations = this.reservations();
              if (reservations) {
                const index = reservations.findIndex(item => item.id === data.data.id);
                if (index !== -1) {
                  reservations[index] = {
                    ...data.data
                  }
                  this.loadInfo(reservations);
                  this.notificationService.showSuccess('Reservación cancelada', data.message);
                }
              }
            }
          },
          error: (error) => {
            this.notificationService.showError('Error', error.error.message);
          }
        })
      }
    })
  }
}
