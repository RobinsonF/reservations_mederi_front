import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { DatePipe } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IEquipment } from '../../../core/models/equipment.mode';
import { faEllipsisH, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { EquipmentService } from '../../../core/services/equipment.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SaveEquipmentComponent } from '../save-equipment/save-equipment.component';
import { DeleteComponent } from '../../../shared/components/delete/delete.component';

@Component({
  selector: 'app-table-equipment',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule,
    MatSortModule, DialogModule, OverlayModule, FontAwesomeModule, DatePipe],
  templateUrl: './table-equipment.component.html',
  styleUrl: './table-equipment.component.scss',
  providers: [NotificationService]
})
export class TableEquipmentComponent {

  displayedColumns: string[] = ['id', 'name', 'description', 'quantity', 'createdAt', 'active', 'actions'];
  equipment = signal<IEquipment[]>([]);
  dataSource = new MatTableDataSource<IEquipment>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  faEllipsisV = faEllipsisV;
  faEllipsisH = faEllipsisH;

  constructor(
    private equipmentService: EquipmentService,
    private dialog: Dialog,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.equipmentService.get().subscribe({
      next: (data) => {
        this.loadInfo(data.data);
      },
      error: (error) => {

      }
    })
  }

  loadInfo(equipment: IEquipment[]) {
    this.equipment.set(equipment);
    this.dataSource.data = this.equipment();
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
    this.dialog.open<any>(SaveEquipmentComponent, {
      data: {
        id: null,
        equipment: null
      }
    }).closed.subscribe(data => {
      if (data.rta) {
        const equipment = this.equipment();
        if (data.equipment) {
          equipment.push(data.equipment);
          this.loadInfo(equipment);
          this.notificationService.showSuccess('Recurso creado', data.message);
        }
      }
    })
  }

  onUpdate(element: any) {
    delete element.isOpen;
    this.dialog.open<any>(SaveEquipmentComponent, {
      data: {
        id: element.id,
        equipment: element
      }
    }).closed.subscribe(data => {
      if (data.rta) {
        const equipment = this.equipment();
        if (data.equipment) {
          const index = equipment.findIndex(item => item.id === data.equipment.id);
          if (index !== -1) {
            equipment[index] = {
              ...data.equipment
            }
            this.loadInfo(equipment);
            this.notificationService.showSuccess('Recurso actualizado', data.message);
          }
        }
      }
    })
  }

  onDelete(id: number) {
    this.dialog.open<any>(DeleteComponent, {
      data: {
        title: '¿Estás seguro que quieres eliminar a este recurso?'
      }
    }).closed.subscribe(data => {
      if (data.rta) {
        this.equipmentService.delete(id).subscribe({
          next: (data) => {
            if (data) {
              let equipment = this.equipment();
              const index = equipment.findIndex(item => item.id === id);
              if (index !== -1) {
                equipment.splice(index, 1);
                this.loadInfo(equipment);
                this.notificationService.showSuccess('Recurso eliminado', 'El recurso se ha eliminado con exito');
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
