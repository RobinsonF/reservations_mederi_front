import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { DatePipe } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IFindAllReservation } from '../../../core/models/reservation.model';
import { faEllipsisH, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { ReservationService } from '../../../core/services/reservation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SaveReservationComponent } from '../save-reservation/save-reservation.component';
import { DeleteComponent } from '../../../shared/components/delete/delete.component';

@Component({
  selector: 'app-reservation-admin',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule,
    MatSortModule, DialogModule, OverlayModule, FontAwesomeModule, DatePipe],
  templateUrl: './reservation-admin.component.html',
  styleUrl: './reservation-admin.component.scss',
  providers: [NotificationService]
})
export class ReservationAdminComponent {

  displayedColumns: string[] = ['date', 'purpose', 'status', 'user', 'room', 'createdAt', 'actions'];
  reservations = signal<IFindAllReservation[]>([]);
  dataSource = new MatTableDataSource<IFindAllReservation>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  faEllipsisV = faEllipsisV;
  faEllipsisH = faEllipsisH;

  constructor(
    private reservationService: ReservationService,
    private dialog: Dialog,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.reservationService.get().subscribe({
      next: (data) => {
        this.loadInfo(data.data);
      },
      error: (error) => {

      }
    })
  }

  loadInfo(reservations: IFindAllReservation[]) {
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
        reservation: null
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
        reservation: element
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
        title: '¿Estás seguro que quieres eliminar a esta reservación?'
      }
    }).closed.subscribe(data => {
      if (data.rta) {
        this.reservationService.delete(id).subscribe({
          next: (data) => {
            if (data) {
              let reservations = this.reservations();
              const index = reservations.findIndex(item => item.id === id);
              if (index !== -1) {
                reservations.splice(index, 1);
                this.loadInfo(reservations);
                this.notificationService.showSuccess('Reservación eliminada', 'La reservación se ha eliminado con exito');
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
