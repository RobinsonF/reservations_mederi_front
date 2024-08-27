import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { IUser } from '../../../core/models/user.model';
import { DatePipe } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [DatePipe, MatPaginatorModule, MatTableModule, MatSortModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'createdAt', 'active'];
  users = signal<IUser[]>([]);
  dataSource = new MatTableDataSource<IUser>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.get().subscribe({
      next: (data) => {
        this.users.set(data.data);
        this.dataSource.data = this.users();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {

      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
