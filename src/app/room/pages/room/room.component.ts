import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TableRoomComponent } from '../../components/table-room/table-room.component';
import { TableEquipmentComponent } from '../../components/table-equipment/table-equipment.component';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [MatTabsModule, TableRoomComponent, TableEquipmentComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent {

}
