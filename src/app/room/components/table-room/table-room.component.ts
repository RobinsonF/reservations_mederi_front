import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { Component, signal, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IFindAllRomm } from '../../../core/models/room.model';
import { faEllipsisH, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { RoomService } from '../../../core/services/room.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SaveRoomComponent } from '../save-room/save-room.component';
import { DeleteComponent } from '../../../shared/components/delete/delete.component';
import { DatePipe } from '@angular/common';
import { RoomEquipmentComponent } from '../room-equipment/room-equipment.component';

@Component({
  selector: 'app-table-room',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule,
    MatSortModule, DialogModule, OverlayModule, FontAwesomeModule, DatePipe],
  templateUrl: './table-room.component.html',
  styleUrl: './table-room.component.scss',
  providers: [NotificationService]
})
export class TableRoomComponent {

  displayedColumns: string[] = ['id', 'name', 'location', 'capacity', 'createdAt', 'active', 'actions'];
  rooms = signal<IFindAllRomm[]>([]);
  dataSource = new MatTableDataSource<IFindAllRomm>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  faEllipsisV = faEllipsisV;
  faEllipsisH = faEllipsisH;

  constructor(
    private roomService: RoomService,
    private dialog: Dialog,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.roomService.get().subscribe({
      next: (data) => {
        this.loadInfo(data.data);
      },
      error: (error) => {

      }
    })
  }

  loadInfo(rooms: IFindAllRomm[]) {
    this.rooms.set(rooms);
    this.dataSource.data = this.rooms();
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
    this.dialog.open<any>(SaveRoomComponent, {
      data: {
        id: null,
        room: null
      }
    }).closed.subscribe(data => {
      if (data.rta) {
        const users = this.rooms();
        if (data.room) {
          users.push(data.room);
          this.loadInfo(users);
          this.notificationService.showSuccess('Sala creada', data.message);
        }
      }
    })
  }

  onUpdate(element: any) {
    delete element.isOpen;
    this.dialog.open<any>(SaveRoomComponent, {
      data: {
        id: element.id,
        room: element
      }
    }).closed.subscribe(data => {
      if (data.rta) {
        const rooms = this.rooms();
        if (data.room) {
          const index = rooms.findIndex(item => item.id === data.room.id);
          if (index !== -1) {
            rooms[index] = {
              ...data.room
            }
            this.loadInfo(rooms);
            this.notificationService.showSuccess('Sala actualizada', data.message);
          }
        }
      }
    })
  }

  onDelete(id: number) {
    this.dialog.open<any>(DeleteComponent, {
      data: {
        title: '¿Estás seguro que quieres eliminar a esta sala?'
      }
    }).closed.subscribe(data => {
      if (data.rta) {
        this.roomService.delete(id).subscribe({
          next: (data) => {
            if (data) {
              let rooms = this.rooms();
              const index = rooms.findIndex(item => item.id === id);
              if (index !== -1) {
                rooms.splice(index, 1);
                this.loadInfo(rooms);
                this.notificationService.showSuccess('Sala eliminada', 'La sala se ha eliminado con exito');
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
