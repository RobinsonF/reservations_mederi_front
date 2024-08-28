import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { IUser } from '../../../core/models/user.model';
import { DatePipe } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { UserSaveComponent } from '../../components/user-save/user-save.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisV, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { DeleteComponent } from '../../../shared/components/delete/delete.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [DatePipe, MatPaginatorModule, MatTableModule,
    MatSortModule, DialogModule, OverlayModule, FontAwesomeModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers: [NotificationService]
})
export class UserComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'createdAt', 'active', 'actions'];
  users = signal<IUser[]>([]);
  dataSource = new MatTableDataSource<IUser>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  faEllipsisV = faEllipsisV;
  faEllipsisH = faEllipsisH;

  constructor(
    private userService: UserService,
    private dialog: Dialog,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.userService.get().subscribe({
      next: (data) => {
        this.loadInfo(data.data);
      },
      error: (error) => {

      }
    })
  }

  loadInfo(users: IUser[]) {
    this.users.set(users);
    this.dataSource.data = this.users();
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
    this.dialog.open<any>(UserSaveComponent, {
      data: {
        id: null,
        user: null
      }
    }).closed.subscribe(data => {
      if (data.rta) {
        const users = this.users();
        if (data.user) {
          users.push(data.user);
          this.loadInfo(users);
          this.notificationService.showSuccess('Usuario creado', data.message);
        }
      }
    })
  }

  onUpdate(element: any) {
    delete element.isOpen;
    this.dialog.open<any>(UserSaveComponent, {
      data: {
        id: element.id,
        user: element
      }
    }).closed.subscribe(data => {
      if (data.rta) {
        const users = this.users();
        if (data.user) {
          const index = users.findIndex(item => item.id === data.user.id);
          if (index !== -1) {
            users[index] = {
              ...data.user
            }
            this.loadInfo(users);
            this.notificationService.showSuccess('Usuario actualizado', data.message);
          }
        }
      }
    })
  }

  onDelete(id: number) {
    this.dialog.open<any>(DeleteComponent, {
      data: {
        title: '¿Estás seguro que quieres eliminar a este usuario?'
      }
    }).closed.subscribe(data => {
      if (data.rta) {
        this.userService.delete(id).subscribe({
          next: (data) => {
            if (data) {
              let users = this.users();
              const index = users.findIndex(item => item.id === id);
              if (index !== -1) {
                users.splice(index, 1);
                this.loadInfo(users);
                this.notificationService.showSuccess('Usuario eliminado', 'El usuario se ha eliminado con exito');
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
